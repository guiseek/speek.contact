import {
  CheckUser,
  CreateUser,
  AuthRequest,
  UserResponse,
  AuthResponse,
  CheckUserResponse,
  AuthUserResponse,
} from '@speek/type'
import {Observable} from 'rxjs'

export abstract class AuthService {
  abstract validateUser(): Observable<AuthUserResponse>
  abstract checkUser(user: CheckUser): Observable<CheckUserResponse>
  abstract createUser(user: CreateUser): Observable<UserResponse>
  abstract login(request: AuthRequest): Observable<AuthResponse>
}
