import Watchlist from '#models/watchlist'
import type { HttpContext } from '@adonisjs/core/http'

export default class WatchlistsController {
  async index({ auth, response, params }: HttpContext) {
    await auth.authenticate()
    const user = auth.getUserOrFail()
    const userId = params.userId

    const watchlist = await Watchlist.query().where('user_id', userId).preload('movie')

    return response.status(200).json(watchlist)
  }

  async store({ request, response, auth, params }: HttpContext) {
    await auth.authenticate()
    const userId = params.userId
    const movieId = request.only(['movieId']).movieId

    const existingWatchlistItem = await Watchlist.query()
      .where('user_id', userId)
      .andWhere('movie_id', movieId)
      .first()

    if (existingWatchlistItem) {
      return response.status(409).json({ message: 'Movie already in watchlist!' })
    }

    await Watchlist.create({ userId: userId, movieId: movieId })
    return response.status(201).json({ message: 'Movie added to watchlist!' })
  }

  async destroy({ params, auth, response, bouncer }: HttpContext) {
    await auth.authenticate()
    const user = auth.getUserOrFail()
    const userId = params.userId
    const movieId = params.movieId

    await bouncer.with('MoviePolicy').authorize('watchlist')

    const watchlistItem = await Watchlist.query()
      .where('user_id', userId)
      .andWhere('movie_id', movieId)
      .first()

    if (!watchlistItem || watchlistItem.userId != userId || watchlistItem.movieId != movieId) {
      return response.status(404).json({ message: 'Item not found' })
    }

    await watchlistItem.delete()
    return response.status(200).json({ message: 'Item removed from watchlist' })
  }
}
