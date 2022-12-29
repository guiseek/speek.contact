export interface CreateUser {
  username: string
  password: string
  email: string
  name: string
  salt?: string
}
