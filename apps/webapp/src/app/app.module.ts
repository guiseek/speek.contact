import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppConnection } from './app.connection';
import { AppSignaling } from './app.signaling';
import { AppConfig } from './app.config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [
    AppConfig,
    AppSignaling,
    AppConnection
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
