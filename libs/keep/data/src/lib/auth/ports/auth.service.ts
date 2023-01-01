import {
  User,
  CheckUser,
  CreateUser,
  AuthRequest,
  UserResponse,
  AuthResponse,
  AuthUserResponse,
  CheckUserResponse,
} from '@speek/type'

export abstract class AuthService {
  abstract validateUser({
    username,
    password,
  }: AuthRequest): Promise<AuthUserResponse>
  abstract checkUser(user: CheckUser): Promise<CheckUserResponse>
  abstract createUser(user: CreateUser): Promise<UserResponse>
  abstract login(user: User): Promise<AuthResponse>
}
