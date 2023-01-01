import {UpdateUser, UserResponse} from '@speek/type'
import {Observable} from 'rxjs'

export abstract class UserService {
  abstract findAll(): Observable<UserResponse[]>
  abstract findOneById(id: number): Observable<UserResponse | null>
  abstract findOneByUsername(username: string): Observable<UserResponse | null>
  abstract update(id: number, updateUser: UpdateUser): Observable<UserResponse>
  abstract remove(id: number): Observable<UserResponse>
}
