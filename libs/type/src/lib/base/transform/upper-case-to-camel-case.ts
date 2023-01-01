import {HeadLetter} from './head-letter'
import {ToLowerCase} from './to-lower-case'
import {ToPascalCase} from './to-pascal-case'
import {TailLetters} from './trail-letters'

export type UpperCaseToCamelCase<T> = `${ToLowerCase<
  HeadLetter<T>
>}${TailLetters<ToPascalCase<T>>}`
