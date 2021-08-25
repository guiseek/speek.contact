import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaUiSharedModule } from '@speek/media/ui-shared';
import { DataContact, PeerContact, SignalContact, Socket } from '@speek/contact/ports';
import { DataContactImpl, PeerContactImpl, SignalContactImpl } from '@speek/contact/adapters';
import { env } from '../envs/env';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppConnection } from './app.connection';
import { AppSignaling } from './app.signaling';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MediaUiSharedModule,
    RouterModule.forRoot(
      [
        // { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
        // {
        //   path: '',
        //   pathMatch: 'full',
        //   redirectTo: 'meet'
        // },
        {
          path: 'meet',
          loadChildren: () =>
            import('./meet/meet.module').then((m) => m.MeetModule),
        },
        {
          path: '',
          loadChildren: () =>
            import('@speek/contact/feature').then(
              (module) => module.ContactFeatureModule
            ),
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [
    {
      provide: SignalContact,
      useFactory: () => {
        return new SignalContactImpl(env.signaling);
      },
    },
    {
      provide: PeerContact,
      useFactory: (signal: SignalContact<Socket>) => {
        return new PeerContactImpl({ iceServers: env.iceServers }, signal);
      },
      deps: [SignalContact],
    },
    {
      provide: DataContact,
      useClass: DataContactImpl
    },
    AppSignaling,
    AppConnection,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
