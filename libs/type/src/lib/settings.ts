export interface Settings {
  audioInput: MediaDeviceInfo | null
  audioOutput: MediaDeviceInfo | null
  videoInput: MediaDeviceInfo | null

  accessToken: string
}
