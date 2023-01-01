import {Exclude} from 'class-transformer'
import {UserResponse, User} from '@speek/type'
import {ApiHideProperty, ApiProperty} from '@nestjs/swagger'

export class UserResponseDto implements UserResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty()
  displayName: string

  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty()
  photoUrl: string

  @ApiProperty()
  status: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @Exclude()
  @ApiHideProperty()
  password: string

  @Exclude()
  @ApiHideProperty()
  salt: string

  constructor(user: User) {
    Object.assign(this, user)
  }
}
