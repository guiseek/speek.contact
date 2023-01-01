import {User} from './user'

export interface UserOAuth extends User {
  provider: string
  authToken: string
  idToken: string
  authorizationCode: string
}
