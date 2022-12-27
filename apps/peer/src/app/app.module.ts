import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {RouterModule} from '@angular/router'

import {AppComponent} from './app.component'
import {appProviders} from './app.providers'
import {appRoutes} from './app.routes'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
  ],
  providers: [appProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
