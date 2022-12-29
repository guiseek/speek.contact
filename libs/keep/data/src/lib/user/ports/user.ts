export class User {
  id: number
  username: string
  password: string
  salt: string
  email: string
  birthday?: Date
  name: string
  photoUrl: string
  status: boolean
  createdAt: Date
  updatedAt: Date
}
