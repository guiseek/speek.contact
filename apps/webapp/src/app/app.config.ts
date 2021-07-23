import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
  server = 'http://localhost:3333';
  webrtc: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.stunprotocol.org:3478' }
    ]
  }
}
