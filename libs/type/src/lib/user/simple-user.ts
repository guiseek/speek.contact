import {User} from './user'

export type SimpleUser = Omit<
  User,
  'password' | 'salt' | 'createdAt' | 'updatedAt'
>
