import {HeadLetter} from './head-letter'
import {LetterToUpper} from './letter-to-upper'
import {ToLowerCase} from './to-lower-case'
import {TailLetters} from './trail-letters'

export type ToSentenceCase<T> = `${LetterToUpper<HeadLetter<T>>}${ToLowerCase<
  TailLetters<T>
>}`
