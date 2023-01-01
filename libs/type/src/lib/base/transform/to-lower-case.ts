import {HeadLetter} from './head-letter'
import {LetterToLower} from './letter-to-lower'
import {TailLetters} from './trail-letters'

export type ToLowerCase<T> = T extends ''
  ? T
  : `${LetterToLower<HeadLetter<T>>}${ToLowerCase<TailLetters<T>>}`
