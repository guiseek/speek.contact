import {Constrain} from '../constrain'
import {ConstrainInt} from '../constrain-int'

export interface VideoConstraints {
  deviceId: Constrain<string>
  height: ConstrainInt
}
