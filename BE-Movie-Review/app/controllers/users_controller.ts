import User from '#models/user'
import { registerUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async login({ auth, request, response }: HttpContext) {
    try {
      const { email, password } = request.all()
      const user = await User.verifyCredentials(email, password)
      const token = await auth.use('jwt').generate(user)

      //to generate a token
      return response.ok(token)
    } catch (error) {
      response.unauthorized(response)
    }
  }
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerUserValidator)
      const user = await User.create({
        username: payload.username,
        email: payload.email,
        password: payload.password,
      })
      response.ok('The user is register successfully.')
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
