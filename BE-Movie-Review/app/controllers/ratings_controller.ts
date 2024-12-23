import Movie from '#models/movie'
import Rating from '#models/rating'
import type { HttpContext } from '@adonisjs/core/http'

export default class RatingsController {
  // Get all ratings of the authenticated user
  async getUserRatings({ response, auth }: HttpContext) {
    const authen = await auth.authenticate()

    const user = auth.getUserOrFail()

    const ratings = await Rating.query().where('user_id', user.id).preload('movie')

    response.ok(ratings)
  }

  // User rating a movie
  async addRate({ request, response, auth, params }: HttpContext) {
    const { rateScore } = request.only(['rateScore'])
    await auth.authenticate()
    const userId = auth.user?.id // Get the authenticated user's ID
    const movieId = params.id

    // Validate the input
    if (!rateScore || rateScore < 1 || rateScore > 10) {
      return response
        .status(400)
        .json({ message: 'Invalid rating value. It must be between 1 and 10.' })
    }

    // Check if the movie exists
    const movie = await Movie.findOrFail(movieId)

    // Check if the user has already rated the movie
    const existingRate = await Rating.query()
      .where('user_id', userId!)
      .andWhere('movie_id', movieId)
      .first()

    if (existingRate) {
      return { message: 'You have already rated this movie.' }
    }

    // Add the new rating to the database
    await Rating.create({
      userId: userId,
      movieId: movieId,
      rating: rateScore,
    })

    // Recalculate the average rating
    const totalRatings = await Rating.query().where('movie_id', movieId).count('* as count')

    const totalRatingsCount = parseInt(totalRatings[0].$extras.count, 10)

    const avgRating = await Rating.query().where('movie_id', movieId).avg('rating as avg')

    const calculatedAvg = parseFloat(avgRating[0].$extras.avg)

    // Update movie's avg_rating
    movie.avg_rating = calculatedAvg || 0

    await movie.save()

    return response.status(200).json({
      message: 'Rating added successfully.',
      new_avg_rating: movie.avg_rating,
      total_ratings: totalRatingsCount,
    })
  }

}
