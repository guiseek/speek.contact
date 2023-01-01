import {
  CheckUser,
  CreateUser,
  AuthRequest,
  UserResponse,
  AuthResponse,
  HttpService,
  CheckUserResponse,
  AuthUserResponse,
} from '@speek/type'
import {AuthService} from '../ports/auth.service'

export class AuthServiceImpl implements AuthService {
  constructor(readonly http: HttpService) {}

  validateUser() {
    return this.http.get<AuthUserResponse>(`/keep/auth/me`)
  }
  checkUser(user: CheckUser) {
    return this.http.post<CheckUserResponse>(`/keep/auth/check`, user)
  }
  createUser(user: CreateUser) {
    return this.http.post<UserResponse>(`/keep/auth/register`, user)
  }
  login(request: AuthRequest) {
    return this.http.post<AuthResponse>(`/keep/auth/login`, request)
  }
}
