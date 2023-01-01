import {BASE} from './base'

export function isValid(value: string) {
  return BASE.REGEX.test(value)
}
