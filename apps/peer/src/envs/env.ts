export const env = {
  prod: false,
  oauth: {
    google: {
      clientId: '1022997783034-mg4hh09im4646t2rkm9cofki3rannhbn.apps.googleusercontent.com',
      secretId: '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'
    }
  },
  gateway: {
    url: 'http://localhost:3333',
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
