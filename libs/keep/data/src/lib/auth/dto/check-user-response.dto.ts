import {ApiProperty} from '@nestjs/swagger'

export class CheckUserResponseDto {
  @ApiProperty()
  exists: boolean

  @ApiProperty()
  message: string

  constructor(exists: boolean, message: string) {
    this.exists = exists
    this.message = message
  }
}
