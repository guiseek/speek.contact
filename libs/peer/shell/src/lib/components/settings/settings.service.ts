import {Injectable} from '@angular/core'
import {SettingsConfig} from '../../interfaces/settings-config'
import {State} from '../../+store/state'

type Settings = SettingsConfig & {
  audioInputList: MediaDeviceInfo[]
  audioOutputList: MediaDeviceInfo[]
  videoInputList: MediaDeviceInfo[]
}

const initialState: Settings = Object.freeze({
  audioInputList: [],
  audioOutputList: [],
  videoInputList: [],
  audioInput: null,
  audioOutput: null,
  videoInput: null,
})

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends State<Settings> {
  audioInputList$ = this.select((s) => s.audioInputList)
  audioOutputList$ = this.select((s) => s.audioOutputList)
  videoInputList$ = this.select((s) => s.videoInputList)

  audioInput$ = this.select((s) => s.audioInput)
  audioOutput$ = this.select((s) => s.audioOutput)
  videoInput$ = this.select((s) => s.videoInput)

  config$ = this.select(({audioInput, audioOutput, videoInput}) => ({
    audioInput,
    audioOutput,
    videoInput,
  }))

  constructor() {
    super(initialState)
  }

  loadDevices() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputList = devices.filter((d) => d.kind === 'audioinput')
      const audioOutputList = devices.filter((d) => d.kind === 'audiooutput')
      const videoInputList = devices.filter((d) => d.kind === 'videoinput')

      const audioInput =
        audioInputList.length > 1
          ? audioInputList.find((d) => d.deviceId === 'default')
          : audioInputList[0]

      const audioOutput =
        audioOutputList.length > 1
          ? audioOutputList.find((d) => d.deviceId === 'default')
          : audioOutputList[0]

      const videoInput =
        videoInputList.length > 1
          ? videoInputList.find((d) => d.deviceId === 'default')
          : videoInputList[0]

      this.setState({
        audioInputList,
        audioOutputList,
        videoInputList,
        audioInput,
        audioOutput,
        videoInput,
      })
    })
  }

  setAudioInput(audioInput: MediaDeviceInfo) {
    this.setState({audioInput})
  }

  setAudioOutput(audioOutput: MediaDeviceInfo) {
    this.setState({audioOutput})
  }

  setVideoInput(videoInput: MediaDeviceInfo) {
    this.setState({videoInput})
  }

  setValue(value: Partial<Settings>) {
    this.setState(value)
  }
}
