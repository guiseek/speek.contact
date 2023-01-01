import {HeadLetter} from './head-letter'
import {ToPascalCase} from './to-pascal-case'
import {TailLetters} from './trail-letters'

export type UpperCaseToPascalCase<T> = `${ToPascalCase<
  HeadLetter<T>
>}${TailLetters<ToPascalCase<T>>}`
