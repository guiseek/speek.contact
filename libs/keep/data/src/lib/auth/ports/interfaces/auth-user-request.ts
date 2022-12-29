import {User} from '../../../user/ports/user'

export interface AuthUserRequest extends Request {
  user: User
}
