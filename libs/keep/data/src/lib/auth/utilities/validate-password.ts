import {compareSync} from 'bcrypt'

export function validatePassword(plain: string, hash: string) {
  return compareSync(plain, hash)
}
