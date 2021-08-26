export const env = {
  production: true,
  signalServer: 'https://gateway.speek.contact',
  iceServers: [
    {
      urls: ['stun:54.152.127.6:3478'],
      username: 'speek',
      credential: 'contact',
      credentialType: 'password',
    },
  ],
};
