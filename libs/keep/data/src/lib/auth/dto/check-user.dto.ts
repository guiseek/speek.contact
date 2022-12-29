import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty} from 'class-validator'

export class CheckUserDto {
  @IsNotEmpty()
  @ApiProperty({
    nullable: false,
  })
  username: string
}
