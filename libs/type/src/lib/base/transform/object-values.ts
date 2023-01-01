export type ObjectValues<T> = T extends Record<any, infer V> ? V : never
