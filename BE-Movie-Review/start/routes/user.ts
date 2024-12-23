import UsersController from '#controllers/users_controller'
import User from '#models/user'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [UsersController, 'login']).as('users.login')
        router.post('/register', [UsersController, 'register']).as('users.register')
      })
      .prefix('/v1/users')
  })
  .prefix('/api')

router.get('/create_user', async () => {
  const user = await User.create({
    username: 'admin001',
    email: 'admin001@gmail.com',
    password: 'admin001',
  })
  console.log(`${user.username} is created!`)
})

router.get('/create_user2', async () => {
  const user = await User.create({
    username: 'user001',
    email: 'user001@gmail.com',
    password: 'user001',
  })
  console.log(`${user.username} is created!`)
})
