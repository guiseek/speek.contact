export interface LocalSettings {
  audioinput: string | null
  videoinput: string | null
  audiooutput: string | null

  audioenabled: boolean | null
  videoenabled: boolean | null
  speakerenabled: boolean | null

  accessToken: string
}
