import router from '@adonisjs/core/services/router'
import './routes/user.js'
import './routes/movie.js'
import './routes/rate.js'
import './routes/watchlist.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
