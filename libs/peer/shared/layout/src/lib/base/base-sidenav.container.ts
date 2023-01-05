import {MediaMatcher} from '@angular/cdk/layout'
import {ChangeDetectorRef} from '@angular/core'

export abstract class BaseSidenavContainer {
  protected mobileQuery: MediaQueryList

  private _mobileQueryListener: () => void

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this._mobileQueryListener = () => changeDetectorRef.detectChanges()
    this.mobileQuery.addEventListener('change', this._mobileQueryListener)
  }

  protected onDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener)
  }
}
