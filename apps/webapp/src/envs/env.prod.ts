export const env = {
  production: true,
  signaling: 'https://gateway.speek.contact',
  iceServers: [
    {
      urls: ['stun:54.90.98.123:3478'],
      username: 'speek',
      credential: 'contact',
      credentialType: 'password',
    },
  ],
};
