export const env = {
  production: true,
  signaling: 'http://localhost:3333',
  iceServers: [
    {
      urls: ['stun:54.90.98.123:3478'],
      username: 'speek',
      credential: 'contact',
      credentialType: 'password',
    },
  ],
};
