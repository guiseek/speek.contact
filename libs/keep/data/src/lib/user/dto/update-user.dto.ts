import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger'
import {UpdateUser} from '@speek/type'
import {CreateUserDto} from './create-user.dto'

export class UpdateUserDto
  extends PartialType(OmitType(CreateUserDto, ['password']))
  implements UpdateUser
{
  @ApiProperty({
    nullable: true,
  })
  id: number
}
