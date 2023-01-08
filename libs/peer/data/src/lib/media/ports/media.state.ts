import {AudioConstraints, VideoConstraints} from '@speek/type'

export interface MediaConstraints {
  audio: AudioConstraints
  video: VideoConstraints
}

export interface MediaState {
  audio: boolean
  video: boolean
  constraints: MediaConstraints
  stream: MediaStream | null
}
