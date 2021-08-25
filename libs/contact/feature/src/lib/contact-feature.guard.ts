import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DevicesConfigurationComponent, toJson } from './devices-configuration';

@Injectable({
  providedIn: 'root',
})
export class ContactFeatureGuard implements CanActivate {
  constructor(readonly dialog: MatDialog) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean {
    let audio: null | string | Partial<MediaDeviceInfo> = localStorage.getItem('audio')
    let video: null | string | Partial<MediaDeviceInfo> = localStorage.getItem('video')

    if (audio) {
      const { deviceId } = toJson<MediaDeviceInfo>(audio as string)
      audio = { deviceId }
    }
    if (video) {
      const { deviceId } = toJson<MediaDeviceInfo>(video as string)
      video = { deviceId }
    }

    if (!audio && !video) {
      return this.openConfiguration(route)
    }

    return true
  }

  openConfiguration(route: ActivatedRouteSnapshot) {
    return this.dialog
      .open(DevicesConfigurationComponent, {
        data: route.paramMap.get('room'),
        closeOnNavigation: false,
        disableClose: true
      })
      .afterClosed();
  }
}
