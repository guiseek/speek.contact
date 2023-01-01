import {Cast} from './cast'
import {SwitchKeyValue} from './switch-key-value'
import {UpperCaseToCamelCase} from './upper-case-to-camel-case'

type CallRecursiveTransformToCamelCaseIfObject<T> = T extends Record<any, any>
  ? TransformKeysToCamelCase<T>
  : T

export type TransformKeysToCamelCase<
  T extends Record<string, any>,
  T0 = {[K in keyof T]: UpperCaseToCamelCase<K>},
  T1 = SwitchKeyValue<T0>,
  T2 = {
    [K in keyof T1]: CallRecursiveTransformToCamelCaseIfObject<
      T[Cast<T1[K], string>]
    >
  }
> = T2
