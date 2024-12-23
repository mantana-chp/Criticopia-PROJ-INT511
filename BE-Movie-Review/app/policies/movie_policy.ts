import User from '#models/user'
import Movie from '#models/movie'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import AdminBasePolicy from './admin_base_policy.js'
import Rating from '#models/rating'
import { BasePolicy } from '@adonisjs/bouncer'
import Role from '../../contract/Role.js'

export default class MoviePolicy extends BasePolicy {
  viewList(user: User | null): AuthorizerResponse {
    return true // Allow all (guests and users)
  }

  view(user: User | null): AuthorizerResponse {
    return true // Allow all (guests and users)
  }

  watchlist(user: User): AuthorizerResponse {
    return user.role === Role.USER
  }
}
