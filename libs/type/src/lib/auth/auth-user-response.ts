import {User} from '../user/user'

export type AuthUserResponse = Pick<User, 'email' | 'displayName' | 'id'>
