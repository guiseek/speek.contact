import {ApiProperty} from '@nestjs/swagger'
import {AuthUserResponse} from '@speek/type'

export class AuthUserResponseDto implements AuthUserResponse {
  @ApiProperty()
  id: number

  @ApiProperty()
  displayName: string

  @ApiProperty()
  email: string

  constructor(id: number, email: string, displayName: string) {
    this.id = id
    this.email = email
    this.displayName = displayName
  }
}
