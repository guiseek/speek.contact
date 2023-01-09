import {State} from '@speek/data'
import {MediaFacade} from '../ports/media.facade'
import {MediaService} from '../ports/media.service'
import {MediaConstraints, MediaState} from '../ports/media.state'

const initialValue: MediaState = Object.freeze({
  audio: true,
  video: true,
  constraints: {
    audio: {
      deviceId: {exact: 'default', ideal: 'default'},
      echoCancellation: {exact: true, ideal: true},
      noiseSupression: {exact: true, ideal: true},
    },
    video: {
      deviceId: {
        exact: 'default',
        ideal: 'default',
      },
      height: {max: 1080, min: 360, exact: 480, ideal: 720},
    },
  },
  stream: null,
  permissions: {
    camera: null,
    microphone: null,
  },
})

export class MediaFacadeImpl extends State<MediaState> implements MediaFacade {
  constraints$ = this.select((state) => state.constraints)
  permissions$ = this.select((state) => state.permissions)
  stream$ = this.select((state) => state.stream)
  audio$ = this.select((state) => state.audio)
  video$ = this.select((state) => state.video)

  get videoElement() {
    return this.service.videoElement
  }

  get constraints() {
    return this.service.getConstraints()
  }

  constructor(private service: MediaService) {
    super(initialValue)
  }

  load() {
    /**
     * audio & video states
     */
    const audio = this.service.audioState
    const video = this.service.videoState
    this.setState({audio, video})

    /**
     * media constraints
     */
    if (!this.service.getConstraints()) {
      const {constraints} = initialValue
      this.service.setConstraints(constraints)
    }
    const constraints = this.service.getConstraints()
    if (constraints) this.setState({constraints})

    /**
     * camera & microphone permissions
     */
    this.service.checkPermission('camera').subscribe((camera) => {
      const {microphone} = this.state.permissions
      this.setState({permissions: {camera, microphone}})
    })

    this.service.checkPermission('microphone').subscribe((microphone) => {
      const {camera} = this.state.permissions
      this.setState({permissions: {camera, microphone}})
    })
  }

  loadStream(constraints: MediaConstraints = this.state.constraints) {
    if (constraints) {
      if (this.state.stream) {
        this.state.stream.getTracks().forEach((track) => track.stop())
        this.setState({stream: null})
      }

      console.log(navigator.mediaDevices.getSupportedConstraints())

      // eslint-disable-next-line no-debugger
      // debugger

      this.service.getUser(constraints).then((stream) => {
        this.videoElement.srcObject = stream
        this.setState({stream})
      })
    }
  }

  updateConstraints(value: Partial<MediaConstraints>) {
    const constraints = {...this.state.constraints, ...value}
    this.service.setConstraints(constraints)
    this.setState({constraints})
  }

  toggleAudio() {
    const audio = !this.state.audio

    if (audio) this.service.enableAudio()
    else this.service.disableAudio()

    if (this.state.stream) {
      this.state.stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = audio))
    }

    this.setState({audio})
  }

  toggleVideo() {
    const video = !this.state.video

    if (video) this.service.enableVideo()
    else this.service.disableVideo()

    if (this.state.stream) {
      this.state.stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = video))
    }

    this.setState({video})
  }
}
