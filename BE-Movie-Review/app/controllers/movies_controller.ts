import Movie from '#models/movie'
import { createMovieValidator } from '#validators/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const movies = await Movie.query().orderBy('avg_rating', 'desc')

    const formattedMovies = movies.map((movie) => {
      const jsonMovie = movie.toJSON()
      return {
        ...jsonMovie,
        ...movie.$extras, // Merge $extras into the JSON object
      }
    })

    response.json(formattedMovies)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const id = params.id
    const movie = await Movie.findOrFail(id)

    const jsonMovie = movie.toJSON()
    const formattedMovies = {
      ...jsonMovie,
      ...movie.$extras, // Merge $extras into the JSON object
    }

    response.ok(formattedMovies)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, auth, bouncer }: HttpContext) {
    const data = request.all()
    console.log(data)

    const user = auth.getUserOrFail() // ต้องเป็น user ที่ login เท่านั้นที่สามารถสร้างได้

    const payload = await createMovieValidator.validate(data)
    console.log(payload)

    await bouncer.with('AdminBasePolicy').authorize('create') // ต้องเป็น admin เท่านั้นที่สามารถสร้างได้

    const movie = new Movie()
    movie.title = payload.title
    movie.primaryImage = payload.primaryImage
    movie.description = payload.description
    movie.cast = payload.cast
    movie.release_date = payload.release_date
    movie.avg_rating = payload.avg_rating
    movie.runtimeMinutes = payload.runtimeMinutes
    movie.type = payload.type

    await movie.save()

    response.created(movie)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, bouncer }: HttpContext) {
    const id = params.id
    const movie = await Movie.findOrFail(id)
    const data = request.all()

    const payload = await createMovieValidator.validate(data)

    await bouncer.with('AdminBasePolicy').authorize('update') // ต้องเป็น admin เท่านั้นที่สามารถแก้ไขได้

    movie.title = payload.title
    movie.primaryImage = payload.primaryImage
    movie.description = payload.description
    movie.cast = payload.cast
    movie.release_date = payload.release_date
    movie.avg_rating = payload.avg_rating
    movie.runtimeMinutes = payload.runtimeMinutes
    movie.type = payload.type

    await movie.save()

    return movie
  }
  /**
   * Delete record
   */
  async destroy({ params, bouncer, response }: HttpContext) {
    const id = params.id //id ของ movie
    const movie = await Movie.findOrFail(id)

    await bouncer.with('AdminBasePolicy').authorize('delete') // ต้องเป็น admin เท่านั้นที่สามารถลบได้

    await movie.delete()

    response.ok({ message: 'Movie deleted' })
  }

  async search({ request, response }: HttpContext) {
    const query = request.qs().q // Retrieve query parameter
    console.log(request.url())

    console.log(query)

    if (!query) {
      return response.status(400).json({ message: 'Search query is required' })
    }

    const movies = await Movie.query().where('title', 'like', `%${query}%`).orderBy('title', 'asc')

    if (!movies.length) {
      console.log('No movies found')

      return response.status(404).json({ message: 'No movies found' })
    }

    return response.json(movies)
  }
}
