import {BASE} from './base'

export function fromText(value: string) {
  return new RegExp(BASE.REG).exec(value)
}
