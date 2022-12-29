import {ApiProperty} from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }
}
