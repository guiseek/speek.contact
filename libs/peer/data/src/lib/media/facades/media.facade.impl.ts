import {State} from '@speek/data'
import {MediaFacade} from '../ports/media.facade'
import {MediaService} from '../ports/media.service'
import {MediaState} from '../ports/media.state'

const initialValue: MediaState = {
  audio: true,
  video: true,
  constraints: {
    audio: {
      deviceId: {exact: 'default', ideal: 'default'},
      echoCancellation: {exact: true, ideal: true},
      noiseSuppression: {exact: true, ideal: true},
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
  error: null,
  permissions: {
    camera: null,
    microphone: null,
  },
}

export class MediaFacadeImpl extends State<MediaState> implements MediaFacade {
  constraints$ = this.select((state) => state.constraints)
  permissions$ = this.select((state) => state.permissions)
  stream$ = this.select((state) => state.stream)
  error$ = this.select((state) => state.error)
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

  loadStream(constraints: MediaStreamConstraints) {
    if (constraints) {
      if (this.state.stream) {
        this.state.stream.getTracks().forEach((track) => track.stop())
        this.setState({stream: null})
      }

      this.service
        .getUser(constraints)
        .then((stream) => {
          this.videoElement.srcObject = stream
          this.setState({stream, error: null})
          this.updateConstraints(constraints)
        })
        .catch(({message}) => {
          this.setState({error: message})
        })
    }
  }

  updateConstraints(value: Partial<MediaStreamConstraints>) {
    const constraints = {...this.state.constraints, ...value}
    this.service.setConstraints(constraints)
    this.setState({constraints})
  }

  toggleAudio() {
    this.service.toggleAudio()

    const audio = !!this.service.audioState

    if (this.state.stream) {
      this.state.stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = audio))
    }

    this.setState({audio})
  }

  setAudio() {
    const audio = !!this.service.audioState

    if (this.state.stream) {
      this.state.stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = audio))
    }

    this.setState({audio})
  }

  toggleVideo() {
    this.service.toggleVideo()

    const video = !!this.service.videoState

    if (this.state.stream) {
      this.state.stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = video))
    }

    this.setState({video})
  }
}
