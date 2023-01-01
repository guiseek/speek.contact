export type TailLetters<T> = T extends `${infer _FirstLetter}${infer Rest}`
  ? Rest
  : never
