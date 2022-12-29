import {hashSync, genSaltSync} from 'bcrypt'

export function createPassword(plain: string) {
  const salt = genSaltSync(10)
  const password = hashSync(plain, salt)
  return {salt, password}
}
