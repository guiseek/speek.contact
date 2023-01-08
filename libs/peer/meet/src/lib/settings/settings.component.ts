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
import {SettingsForm} from '../forms/settings.form'
import {SettingsFacade} from './settings.facade'

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
    readonly facade: SettingsFacade
  ) {}

  protected onAudioChange(deviceId: string) {
    this.facade.setAudioId(deviceId)
    this.facade.loadStream()
  }

  protected onVideoChange(deviceId: string) {
    this.facade.setVideoId(deviceId)
    this.facade.loadStream()
  }

  protected onSpeakerChange(deviceId: string) {
    this.facade.setSpeakerId(deviceId)
    this.facade.loadStream()
  }

  protected toggleAudio() {
    this.form.toggleAudio()
    this.facade.toggleAudioState()
  }

  protected toggleVideo() {
    this.form.toggleVideo()
    this.facade.toggleVideoState()
  }

  ngAfterViewInit() {
    const videoElement = this.videoRef.nativeElement
    videoElement.appendChild(this.facade.videoElement)
  }

  ngOnInit() {

    // this.facade.loadState()
    // console.log(this.facade.deviceState);

    // this.form.patchValue(this.facade.deviceState)
    // this.facade.loadStream(this.constraints)

    // this.form.audio.valueChanges.subscribe(({deviceId}) => {
    //   if (deviceId) this.facade.setAudioId(deviceId)
    // })

    // this.form.video.valueChanges.subscribe(({deviceId}) => {
    //   if (deviceId) this.facade.setVideoId(deviceId)
    // })

    // this.form.speaker.valueChanges.subscribe(({deviceId}) => {
    //   if (deviceId) this.facade.setSpeakerId(deviceId)
    // })
  }

  ngOnDestroy() {
    this.sub.unsub()
  }
}
