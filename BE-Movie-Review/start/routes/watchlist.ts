import WatchlistsController from '#controllers/watchlists_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/users/:userId/watchlists', [WatchlistsController, 'index']).as('watchlists.index')
    router
      .post('/users/:userId/watchlists', [WatchlistsController, 'store'])
      .as('watchlists.create')
    router
      .delete('/users/:userId/watchlists/:movieId', [WatchlistsController, 'destroy'])
      .as('watchlists.destroy')
  })
  .prefix('/api/v1')
  .use(middleware.auth())
