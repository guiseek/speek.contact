import {isPlatformBrowser} from './is-platform'

let hasV8BreakIterator: boolean
try {
  hasV8BreakIterator = typeof Intl !== 'undefined' && 'v8BreakIterator' in Intl
} catch {
  hasV8BreakIterator = false
}

declare global {
  interface Navigator {
    userAgentData: {
      brands: {brand: string; version: string}[]
    }
  }
}

const userAgentData = (brand: string) => {
  if ('userAgentData' in navigator) {
    return new RegExp(brand).test(navigator.userAgentData.brands[2].brand)
  }
  return false
}

export class Platform {
  isBrowser = this._platformId
    ? isPlatformBrowser(this._platformId)
    : typeof document === 'object' && !!document

  EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent)

  TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent)

  BLINK =
    this.isBrowser &&
    !!('chrome' in window || hasV8BreakIterator) &&
    typeof CSS !== 'undefined' &&
    !this.EDGE &&
    !this.TRIDENT

  CHROME = this.BLINK && userAgentData('Google Chrome')

  BRAVE = this.BLINK && userAgentData('Brave')

  WEBKIT =
    this.isBrowser &&
    /AppleWebKit/i.test(navigator.userAgent) &&
    !this.BLINK &&
    !this.EDGE &&
    !this.TRIDENT

  IOS =
    this.isBrowser &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !('MSStream' in window)

  FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent)

  ANDROID =
    this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT

  SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT

  constructor(private _platformId: string) {}
}
