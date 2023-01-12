import {AudioConstraints, VideoConstraints} from '@speek/type'

export interface MediaActive {
  audio: boolean
  video: boolean
}

export interface MediaConstraints {
  audio: AudioConstraints
  video: VideoConstraints
}

export interface MediaPermissions {
  camera: PermissionState | null
  microphone: PermissionState | null
}

export interface MediaState {
  audio: boolean
  video: boolean
  constraints: MediaStreamConstraints
  stream: MediaStream | null
  error: string | null
  permissions: MediaPermissions
}
