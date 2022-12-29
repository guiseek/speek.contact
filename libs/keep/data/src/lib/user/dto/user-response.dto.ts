import {UserResponse} from '../../user/ports/interfaces'
import {Exclude} from 'class-transformer'
import {User} from '../ports/user'

export class UserResponseDto implements UserResponse {
  id: number
  username: string
  email: string
  name: string
  photoUrl: string
  status: boolean
  createdAt: Date
  updatedAt: Date

  @Exclude()
  password: string

  @Exclude()
  salt: string

  constructor(user: User) {
    Object.assign(this, user)
  }
}
