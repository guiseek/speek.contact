import {Constrain} from '../constrain'

export interface AudioConstraints {
  deviceId: Constrain<string>
  echoCancellation: Constrain<boolean>
  noiseSupression: Constrain<boolean>
}
