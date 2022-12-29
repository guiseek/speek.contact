import {User} from '../user/user'

export interface AuthUserRequest extends Request {
  user: User
}
