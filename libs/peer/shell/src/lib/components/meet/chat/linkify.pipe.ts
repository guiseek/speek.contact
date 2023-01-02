import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'linkify'})
export class LinkifyPipe implements PipeTransform {
  transform(value: string) {
    return value.replace(/(https?:\/\/[^\s]+)/g, (url) => {
      return `<a href="${url}">${url}</a>`
    })
  }
}
