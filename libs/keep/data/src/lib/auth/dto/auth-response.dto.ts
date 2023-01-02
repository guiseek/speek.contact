import {ApiProperty} from '@nestjs/swagger'
import {AuthResponse} from '@speek/type'

export class AuthResponseDto implements AuthResponse {
  @ApiProperty()
  accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
