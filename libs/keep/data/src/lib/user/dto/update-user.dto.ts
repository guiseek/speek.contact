import {PartialType} from '@nestjs/mapped-types'
import { UpdateUser } from '../ports/interfaces'
import {CreateUserDto} from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) implements UpdateUser {
  id: number
}
