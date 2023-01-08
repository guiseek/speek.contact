import {Primitive} from './primitive'

export interface Constrain<T extends Primitive> {
  ideal: T
  exact?: T | null
}
