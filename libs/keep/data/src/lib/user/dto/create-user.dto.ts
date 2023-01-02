import {IsEmail, IsString, MaxLength, MinLength} from 'class-validator'
import {ApiProperty, ApiHideProperty} from '@nestjs/swagger'
import {CreateUser} from '@speek/type'

export class CreateUserDto implements CreateUser {
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

  @IsEmail()
  @ApiProperty({
    nullable: false,
  })
  email: string

  @IsString()
  @MaxLength(500)
  @ApiProperty({
    nullable: false,
  })
  displayName: string

  @ApiHideProperty()
  salt?: string
}
