import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {BrowserModule} from '@angular/platform-browser'
import {RouterModule} from '@angular/router'
import {NgModule} from '@angular/core'

import {AppComponent} from './app.component'
import {appProviders} from './app.providers'
import {appConfig, appRoutes} from './app.routes'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, appConfig),
  ],
  providers: [...appProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
