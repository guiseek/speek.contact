import {User} from './user'

export interface UserCredential extends User {
  username: string
  password: string
  salt: string
}
