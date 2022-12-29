import {Provider} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {UserService} from '../user/ports/user.service'
import {AuthService} from './ports/auth.service'
import {AuthServiceImpl} from './services/auth.service.impl'

export const AUTH_PROVIDERS: Provider<unknown>[] = [
  {
    provide: AuthService,
    useFactory: (userService: UserService, jwtService: JwtService) =>
      new AuthServiceImpl(userService, jwtService),
    inject: [UserService, JwtService],
  },
]
