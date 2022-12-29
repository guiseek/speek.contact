import {Exclude} from 'class-transformer'
import {UserResponse, User} from '@speek/type'

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
