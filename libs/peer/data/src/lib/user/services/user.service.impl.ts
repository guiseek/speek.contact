import {UserResponse, HttpService, UpdateUser} from '@speek/type'
import {UserService} from '../ports/user.service'

export class UserServiceImpl implements UserService {
  constructor(readonly http: HttpService) {}

  findAll() {
    return this.http.get<UserResponse[]>(`/keep/user`)
  }

  findOneById(id: number) {
    return this.http.get<UserResponse | null>(`/keep/user/${id}`)
  }

  findOneByUsername(username: string) {
    return this.http.get<UserResponse | null>(`/keep/user/${username}`)
  }

  update(id: number, updateUser: UpdateUser) {
    return this.http.patch<UserResponse>(`/keep/user/${id}`, updateUser)
  }

  remove(id: number) {
    return this.http.delete<UserResponse>(`/keep/user/${id}`)
  }
}
