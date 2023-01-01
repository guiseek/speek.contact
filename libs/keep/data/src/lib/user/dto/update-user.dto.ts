import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger'
import {CreateUserDto} from './create-user.dto'

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'])
) {
  @ApiProperty({
    nullable: true,
  })
  id: number
}
