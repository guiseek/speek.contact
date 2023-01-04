export interface User {
  id: number
  username: string
  password: string
  salt: string
  email: string
  photoUrl: string
  displayName: string
  firstName: string
  lastName: string
  birthday?: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}
