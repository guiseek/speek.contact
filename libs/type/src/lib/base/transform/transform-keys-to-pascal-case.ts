import {Cast} from './cast'
import {SwitchKeyValue} from './switch-key-value'
import {UpperCaseToPascalCase} from './upper-case-to-pascal-case'

type CallRecursiveTransformToPascalCaseIfObject<T> = T extends Record<any, any>
  ? TransformKeysToPascalCase<T>
  : T

export type TransformKeysToPascalCase<
  T extends Record<string, any>,
  T0 = {[K in keyof T]: UpperCaseToPascalCase<K>},
  T1 = SwitchKeyValue<T0>,
  T2 = {
    [K in keyof T1]: CallRecursiveTransformToPascalCaseIfObject<
      T[Cast<T1[K], string>]
    >
  }
> = T2
