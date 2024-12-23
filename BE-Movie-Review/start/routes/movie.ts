import MoviesController from '#controllers/movies_controller'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.get('/movies', [MoviesController, 'index']).as('movies.index') // List all movies
        router.get('/movies/search', [MoviesController, 'search']).as('movies.search') // Search for a movie
        router.get('/movies/:id', [MoviesController, 'show']).as('movies.show') // Get movie details
      })
      .prefix('/v1')
      .use(middleware.guest())

    // Protected routes (accessible by authenticated users/admins)
    router
      .group(() => {
        router.post('/movies', [MoviesController, 'store']).as('movies.store') // Create a movie
        router.put('/movies/:id', [MoviesController, 'update']).as('movies.update') // Update a movie
        router.delete('/movies/:id', [MoviesController, 'destroy']).as('movies.destroy') // Delete a movie
      })
      .prefix('/v1')
      .use(middleware.auth())
  })
  .prefix('/api')
