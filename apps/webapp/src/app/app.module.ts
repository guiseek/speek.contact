import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SignalingProvider } from '../providers/signaling.provider';
import { ContactProvider } from '../providers/contact.provider';
import { PeerProvider } from '../providers/peer.provider';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppConnection } from './app.connection';
import { AppSignaling } from './app.signaling';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [{ path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
        // {
        //   path: '',
        //   pathMatch: 'full',
        //   redirectTo: 'meet'
        // },
        // {
        //   path: 'meet',
        //   loadChildren: () =>
        //     import('./meet/meet.module')
        //       .then((m) => m.MeetModule),
        // },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [
    // SignalServerProvider.withValue('http://localhost:3333'),
    // IceServersProvider.withValue(env.iceServers),
    PeerProvider.withDefault(),
    ContactProvider.withDefault(),
    SignalingProvider.withDefault(),
    AppSignaling,
    AppConnection,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
