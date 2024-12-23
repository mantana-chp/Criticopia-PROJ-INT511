import User from '#models/user'
// import AdminBase from '#models/admin_base'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Role from '../../contract/Role.js'

export default class AdminBasePolicy extends BasePolicy {
  async before(user: User | null, action: string, ...params: any[]) {
    // ถ้าไม่มี user ก็ไม่ต้องทำอะไรเลย
    if (!user) {
      return false
    }

    if (user?.role === Role.ADMIN) {
      return true
    }
  }

  view(user: User): AuthorizerResponse {
    return user.role === Role.ADMIN || user.role === Role.USER
  }

  create(user: User): AuthorizerResponse {
    return user.role === Role.ADMIN
  }

  delete(user: User): AuthorizerResponse {
    return user.role === Role.ADMIN
  }

  viewList(user: User): AuthorizerResponse {
    return false
  }

  edit(user: User): AuthorizerResponse {
    return user.role === Role.ADMIN
  }

  update(user: User): AuthorizerResponse {
    return user.role === Role.ADMIN
  }
}
