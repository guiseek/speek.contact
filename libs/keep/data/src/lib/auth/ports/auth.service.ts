import {
  User,
  CheckUser,
  CreateUser,
  AuthRequest,
  UserResponse,
  AuthResponse,
} from '@speek/type'

export abstract class AuthService {
  abstract validateUser({username, password}: AuthRequest): Promise<User>
  abstract checkUser(user: CheckUser): Promise<User>
  abstract createUser(user: CreateUser): Promise<UserResponse>
  abstract login(user: User): Promise<AuthResponse>
}
