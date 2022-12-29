export const env = {
  prod: true,
  gateway: {
    url: 'http://keep.speek.contact',
  },
  configuration: {
    iceServers: [
      {
        // urls: ['stun:54.90.98.123:3478'],
        urls: ['stun:3.82.157.149:3478'],
        username: 'speek',
        credential: 'contact',
        credentialType: 'password',
      },
    ],
  },
  constraints: {
    audio: {
      channelCount: {
        ideal: 1,
      },
      echoCancellation: true,
      frameRate: {
        ideal: 22000,
      },
    },
    video: {
      width: {
        min: 480,
        max: 1280,
        ideal: 1280,
      },
      height: {
        min: 320,
        max: 720,
        ideal: 720,
      },
      facingMode: {
        ideal: 'user',
      },
      frameRate: {
        ideal: 60,
        min: 10,
      },
    },
  },
}
