import {ApiProperty} from '@nestjs/swagger'
import {
  IsNumber,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator'
import {UpdateUser} from '@speek/type'

export class UpdateUserDto implements UpdateUser {
  @IsString()
  @ApiProperty({
    nullable: false,
  })
  username: string

  @IsString()
  @MaxLength(500)
  @ApiProperty({
    nullable: false,
  })
  displayName: string

  @ApiProperty()
  @IsDateString()
  birthday?: string

  @IsString()
  @ApiProperty({
    nullable: false,
  })
  lastName: string

  @IsString()
  @ApiProperty({
    nullable: false,
  })
  firstName: string

  @IsNumber()
  @ApiProperty({
    nullable: false,
  })
  id: number
}
