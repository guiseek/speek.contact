export interface CreateUser {
  username: string
  password: string
  email: string
  displayName: string
  salt?: string
}
