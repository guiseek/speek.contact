import {CreateUser, UpdateUser} from './interfaces'
import {User} from './user'

export abstract class UserService {
  abstract findAll(): Promise<User[]>
  abstract createOne(createUser: CreateUser): Promise<User>
  abstract findOneById(id: number): Promise<User>
  abstract findOneByUsername(username: string): Promise<User | null>
  abstract update(id: number, updateUser: UpdateUser): Promise<User>
  abstract remove(id: number): Promise<User>
}
