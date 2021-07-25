import { env } from './../envs/env';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppConnection } from './app.connection';
import { AppSignaling } from './app.signaling';
import { SignalServerProvider} from '../providers/signal-server.provider';
import { IceServersProvider } from '../providers/ice-servers.provider';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [
    SignalServerProvider.withValue('http://localhost:3333'),
    IceServersProvider.withValue(env.iceServers),
    AppSignaling,
    AppConnection,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
