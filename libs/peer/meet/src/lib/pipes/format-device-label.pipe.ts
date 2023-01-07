import {Pipe, PipeTransform} from '@angular/core'

@Pipe({ name: 'formatDeviceLabel' })
export class FormatDeviceLabelPipe implements PipeTransform {
  transform(value: string, ...[index = 0, fallback = '']: [number?, string?]) {
    fallback = fallback ? `${index + 1}.° ${fallback}` : `${index + 1}.°`
    return value.split('(').shift() || fallback
  }
}
