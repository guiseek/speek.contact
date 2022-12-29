import {AuthRequest, AuthResponse, CheckUser} from './interfaces'
import {CreateUser, UserResponse} from './interfaces/interfaces'
import {User} from '../../user/ports/user'

export abstract class AuthService {
  abstract validateUser({username, password}: AuthRequest): Promise<User>
  abstract checkUser(user: CheckUser): Promise<User>
  abstract createUser(user: CreateUser): Promise<UserResponse>
  abstract login(user: User): Promise<AuthResponse>
}
