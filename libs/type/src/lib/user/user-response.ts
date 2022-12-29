import {User} from './user'

export type UserResponse = Omit<User, 'password' | 'salt'>
