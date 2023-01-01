export type HeadLetter<T> = T extends `${infer FirstLetter}${infer _Rest}`
  ? FirstLetter
  : never
