import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'filterDevices'})
export class FilterDevicesPipe implements PipeTransform {
  transform<K extends keyof MediaDeviceInfo>(
    value: MediaDeviceInfo[],
    ...[key, criteria]: [K, MediaDeviceInfo[K]]
  ) {
    return value.filter((info) => info[key] === criteria)
  }
}
