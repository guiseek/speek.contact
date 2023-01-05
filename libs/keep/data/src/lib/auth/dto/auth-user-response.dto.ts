import {ApiProperty} from '@nestjs/swagger'
import {AuthUserResponse} from '@speek/type'

export class AuthUserResponseDto implements AuthUserResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty()
  displayName: string

  constructor(
    id: number,
    email: string,
    username: string,
    displayName: string
  ) {
    this.id = id
    this.email = email
    this.username = username
    this.displayName = displayName
  }
}
