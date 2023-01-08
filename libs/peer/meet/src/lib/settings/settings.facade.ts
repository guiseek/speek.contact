import {Injectable} from '@angular/core'
import {State} from '@speek/data'
import {SettingsService} from './settings.service'

interface SettingsState {
  audioState: boolean
  audioId: string | null
  speakerState: boolean
  speakerId: string | null
  videoState: boolean
  videoId: string | null
  devices: MediaDeviceInfo[]
  stream: MediaStream | null
}

const settingsInitialState: SettingsState = Object.freeze({
  audioState: true,
  audioId: null,
  speakerState: true,
  speakerId: null,
  videoState: true,
  videoId: null,
  devices: [],
  stream: null,
})

@Injectable({providedIn: 'root'})
export class SettingsFacade extends State<SettingsState> {
  audioState$ = this.select((state) => state.audioState)
  speakerState$ = this.select((state) => state.speakerState)
  videoState$ = this.select((state) => state.videoState)
  devices$ = this.select((state) => state.devices)
  stream$ = this.select((state) => state.stream)
  state$ = this.select((state) => state)

  get videoElement() {
    return this.service.videoElement
  }

  get deviceState() {
    return {
      audio: {
        deviceId: this.state.audioId,
        enabled: this.state.audioState,
      },
      video: {
        deviceId: this.state.videoId,
        enabled: this.state.videoState,
      },
      speaker: {
        deviceId: this.state.speakerId,
        enabled: this.state.speakerState,
      },
    }
  }

  get setSinkIdSupported() {
    return this.service.setSinkIdSupported
  }

  constructor(private service: SettingsService) {
    super(settingsInitialState)
  }

  loadState() {
    const audioDeviceId = this.service.getDeviceId('audioinput')
    if (audioDeviceId) this.setAudioId(audioDeviceId)

    const audioEnabled = this.service.getDeviceState('audioenabled')
    this.setAudioState(!!audioEnabled)

    const videoDeviceId = this.service.getDeviceId('videoinput')
    if (videoDeviceId) this.setVideoId(videoDeviceId)

    const videoEnabled = this.service.getDeviceState('videoenabled')
    console.log(videoEnabled);
    console.log(!!videoEnabled);

    this.setVideoState(!!videoEnabled)

    const speakerDeviceId = this.service.getDeviceId('audiooutput')
    if (speakerDeviceId) this.setSpeakerId(speakerDeviceId)

    const speakerEnabled = this.service.getDeviceState('speakerenabled')
    this.setSpeakerState(!!speakerEnabled)
  }

  loadDevices(kind?: MediaDeviceKind) {
    const devices$ = navigator.mediaDevices.enumerateDevices()

    const loadDevices = (kind?: MediaDeviceKind) => async () => {
      const devices = kind
        ? (await devices$).filter((device) => device.kind === kind)
        : await devices$

      this.setState({devices})
    }

    loadDevices(kind)()

    navigator.mediaDevices.ondevicechange = loadDevices(kind)
  }

  loadStream(constraints: MediaStreamConstraints = {}) {
    this.service.getStream(constraints).then((stream) => {
      this.service.setVideoStream(stream)
      this.setState({stream})
    })
  }

  applyVideoConstraints(constraints: MediaTrackConstraints) {
    if (this.state.stream) {
      const [videoTrack] = this.state.stream.getVideoTracks()
      videoTrack.applyConstraints(constraints)
    }
  }

  applyAudioConstraints(constraints: MediaTrackConstraints) {
    if (this.state.stream) {
      const [audioTrack] = this.state.stream.getAudioTracks()
      audioTrack.applyConstraints(constraints)
    }
  }

  setAudioId(audioId: string) {
    this.service.setItem('audioinput', audioId)
    this.setState({audioId})
  }

  setVideoId(videoId: string) {
    this.service.setItem('videoinput', videoId)
    this.setState({videoId})
  }

  setSpeakerId(speakerId: string) {
    this.service.setItem('audiooutput', speakerId)
    this.service.setSinkId(speakerId)
    this.setState({speakerId})
  }

  setAudioState(audioState: boolean) {
    if (this.state.stream) {
      this.service.setItem('audioenabled', audioState)
      this.setState({audioState})
      this.state.stream.getAudioTracks().forEach((track) => {
        track.enabled = audioState
      })
    }
  }

  setVideoState(videoState: boolean) {
    if (this.state.stream) {
      this.setState({videoState})
      this.service.setItem('videoenabled', videoState)
      this.state.stream.getVideoTracks().forEach((track) => {
        track.enabled = videoState
      })
    }
  }

  setSpeakerState(speakerState: boolean) {
    this.setState({speakerState})
    this.service.videoElement.muted = !speakerState
  }

  toggleAudioState() {
    this.setAudioState(!this.state.audioState)
  }

  toggleVideoState() {
    this.setVideoState(!this.state.videoState)
  }

  toggleSpeakerState() {
    this.setSpeakerState(!this.state.speakerState)
  }
}
