import {
  Inject,
  OnInit,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core'
import {SubAsync} from '@speek/utils'
import {combineLatest} from 'rxjs'
import {SettingsForm} from '../forms/settings.form'
import {SettingsService} from './settings.service'

@Component({
  selector: 'peer-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoRef')
  private videoRef!: ElementRef<HTMLDivElement>

  protected form = new SettingsForm()

  private sub = new SubAsync()

  constructor(
    @Inject('peer.constraints')
    private constraints: MediaStreamConstraints,
    readonly service: SettingsService
  ) {}

  protected onSelectionChange(kind: MediaDeviceKind, deviceId: string) {
    this.service.setItem(kind, deviceId)
    this.service.loadStream(this.getConstraints())
  }

  protected onSpeakerChange(deviceId: string) {
    this.service.setItem('audiooutput', deviceId)
    this.service.setSinkId(deviceId)
  }

  protected toggleAudio() {
    this.form.toggleAudio()
    this.service.setItem('audioenabled', !!this.form.audioEnabled)
  }

  protected toggleVideo() {
    this.form.toggleVideo()
    this.service.setItem('videoenabled', !!this.form.videoEnabled)
  }

  private getConstraints() {
    return this.service.getConstraints(this.constraints)
  }

  ngAfterViewInit() {
    this.videoRef.nativeElement.appendChild(this.service.videoElement)

    this.service.loadStream(this.getConstraints())
  }

  ngOnInit() {
    const audioDeviceId = this.service.getDeviceId('audioinput')
    const audioEnabled = this.service.getDeviceState('audioenabled')

    const videoDeviceId = this.service.getDeviceId('videoinput')
    const videoEnabled = this.service.getDeviceState('videoenabled')

    this.sub.async = this.service.stream$.subscribe((stream) => {
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !!audioEnabled))
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !!videoEnabled))
    })

    this.form.patchValue({
      audio: {
        echoCancellation: true,
        deviceId: audioDeviceId,
        enabled: audioEnabled,
      },
      video: {
        deviceId: videoDeviceId,
        enabled: videoEnabled,
      },
      speaker: {
        deviceId: this.service.getDeviceId('audiooutput'),
        enabled: this.service.getDeviceState('speakerenabled') ?? true,
      },
    })

    combineLatest([
      this.service.stream$,
      this.form.audio.valueChanges,
    ]).subscribe(([stream, {enabled}]) =>
      stream.getAudioTracks().forEach((track) => (track.enabled = !!enabled))
    )

    combineLatest([
      this.service.stream$,
      this.form.video.valueChanges,
    ]).subscribe(([stream, {enabled}]) =>
      stream.getVideoTracks().forEach((track) => (track.enabled = !!enabled))
    )
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
