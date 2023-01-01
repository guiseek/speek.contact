import {ToSentenceCase} from './to-sentence-case'

export type ToPascalCase<T> = T extends ``
  ? T
  : T extends `${infer FirstWord}_${infer RestLetters}`
  ? `${ToSentenceCase<FirstWord>}${ToPascalCase<RestLetters>}`
  : ToSentenceCase<T>
