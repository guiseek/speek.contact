import {CreateUser} from './create-user'

export interface UpdateUser extends Partial<Omit<CreateUser, 'password'>> {
  birthday?: string
  firstName: string
  lastName: string
  id: number
}
