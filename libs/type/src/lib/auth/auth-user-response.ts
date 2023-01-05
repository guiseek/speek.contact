import {User} from '../user/user'

export type AuthUserResponse = Pick<
  User,
  'email' | 'username' | 'displayName' | 'id'
>
