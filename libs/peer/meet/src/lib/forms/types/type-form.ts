import {FormControl} from '@angular/forms'

export type TypeForm<T> = {
  [K in keyof T]: FormControl<T[K]>
}
