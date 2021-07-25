// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `env.ts` with `env.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const env: {
  production: boolean;
  signalServer: string;
  iceServers: RTCIceServer[];
} = {
  production: false,
  signalServer: 'http://localhost:3333',
  iceServers: [
    {
      urls: ['stun:54.90.98.123:3478'],
      username: 'speek',
      credential: 'contact',
      credentialType: 'password',
    },
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
