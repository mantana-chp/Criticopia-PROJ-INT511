import RatingsController from '#controllers/ratings_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/rates', [RatingsController, 'getUserRatings']).as('rates.getMovieRating')
    router.post('/movies/:id/rates', [RatingsController, 'addRate']).as('rates.rate')
  })
  .prefix('/api/v1')
  .use(middleware.auth())
