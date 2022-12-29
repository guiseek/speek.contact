import {IsString, MinLength} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'
import {AuthRequest} from '@speek/type'

export class AuthRequestDto implements AuthRequest {
  @IsString()
  @ApiProperty({
    nullable: false,
  })
  username: string

  @IsString()
  @MinLength(6)
  @ApiProperty({
    nullable: false,
  })
  password: string
}
