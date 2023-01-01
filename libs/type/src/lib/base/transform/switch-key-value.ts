import {ObjectValues} from './object-values'

export type SwitchKeyValue<
  T,
  T1 extends Record<string, any> = {
    [K in keyof T]: {key: K; value: T[K]}
  },
  T2 = {
    [K in ObjectValues<T1>['value']]: Extract<
      ObjectValues<T1>,
      {value: K}
    >['key']
  }
> = T2
