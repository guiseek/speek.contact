import {inject, Pipe, PipeTransform} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser'

@Pipe({name: 'linkify'})
export class LinkifyPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer)

  transform(value: string) {
    const link = value.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => `<a href="${url}">${url}</a>`
    )
    return this.sanitizer.bypassSecurityTrustHtml(link)
  }
}
