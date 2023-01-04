import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {ReactiveFormsModule} from '@angular/forms'
import {MaterialModule} from './shared/material.module'
import {CdkModule} from './shared/cdk.module'
import {PeerShellComponent} from './peer-shell.component'
import {MeetComponent, HomeComponent, AuthComponent} from './containers'
import {peerShellRoutes} from './lib.routes'
// prettier-ignore
import {SettingsDialog, AudioFrequencyDirective, AudioComponent, VideoComponent, SignInComponent, SignUpComponent, CheckUserDirective, MeetToolbarComponent, LocalStreamComponent, ChatDialog} from './components';
import {LinkifyPipe} from './components/meet/chat/linkify.pipe'
import {UserComponent} from './containers/user/user.component'
import {UserToolbarComponent} from './components/user/toolbar/toolbar.component'
import {MatIconRegistry} from '@angular/material/icon'
import {DomSanitizer} from '@angular/platform-browser'

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(peerShellRoutes),
    CdkModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PeerShellComponent,
    SettingsDialog,
    AudioComponent,
    VideoComponent,
    MeetComponent,
    HomeComponent,
    AudioFrequencyDirective,
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    CheckUserDirective,
    MeetToolbarComponent,
    LocalStreamComponent,
    ChatDialog,
    LinkifyPipe,
    UserComponent,
    UserToolbarComponent,
  ],
})
export class PeerShellModule {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    const ICONS = [
      [
        'background_replace',
        `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.1 11V8.875L8.975 3H11.1L3.1 11ZM3 6.85V4.725L4.725 3H6.85L3 6.85ZM16.175 6.425C16.0083 6.24167 15.8333 6.0625 15.65 5.8875C15.4667 5.7125 15.2667 5.55833 15.05 5.425L17.475 3H19.6L16.175 6.425ZM5.5 14.975L7.425 13.05C7.54167 13.2333 7.6625 13.4 7.7875 13.55C7.9125 13.7 8.05 13.8417 8.2 13.975L7.725 14.1C7.34167 14.2167 6.96667 14.35 6.6 14.5C6.23333 14.65 5.86667 14.8083 5.5 14.975ZM17.45 9.425C17.4167 9.125 17.3667 8.83333 17.3 8.55C17.2333 8.26667 17.1333 7.99167 17 7.725L21 3.725V5.875L17.45 9.425ZM11.725 4.5L13.225 3H15.35L13.6 4.75C13.3333 4.66667 13.0708 4.60417 12.8125 4.5625C12.5542 4.52083 12.2833 4.5 12 4.5H11.725ZM3 15.375V13.25L6.5 9.75V10C6.5 10.2833 6.51667 10.5583 6.55 10.825C6.58333 11.0917 6.65 11.35 6.75 11.6L3 15.375ZM19.75 15.65C19.55 15.4667 19.3333 15.3167 19.1 15.2C18.8667 15.0833 18.6333 14.975 18.4 14.875L21 12.275V14.4L19.75 15.65ZM16.85 14.3C16.6667 14.25 16.4875 14.1958 16.3125 14.1375C16.1375 14.0792 15.9583 14.025 15.775 13.975C16.1083 13.6917 16.3875 13.3667 16.6125 13C16.8375 12.6333 17.025 12.2417 17.175 11.825L21 8V10.15L16.85 14.3ZM12 14C10.9 14 9.95833 13.6083 9.175 12.825C8.39167 12.0417 8 11.1 8 10C8 8.9 8.39167 7.95833 9.175 7.175C9.95833 6.39167 10.9 6 12 6C13.1 6 14.0417 6.39167 14.825 7.175C15.6083 7.95833 16 8.9 16 10C16 11.1 15.6083 12.0417 14.825 12.825C14.0417 13.6083 13.1 14 12 14ZM12 12.5C12.7 12.5 13.2917 12.2583 13.775 11.775C14.2583 11.2917 14.5 10.7 14.5 10C14.5 9.3 14.2583 8.70833 13.775 8.225C13.2917 7.74167 12.7 7.5 12 7.5C11.3 7.5 10.7083 7.74167 10.225 8.225C9.74167 8.70833 9.5 9.3 9.5 10C9.5 10.7 9.74167 11.2917 10.225 11.775C10.7083 12.2583 11.3 12.5 12 12.5ZM4 21V19.225C4 18.6583 4.14167 18.1333 4.425 17.65C4.70833 17.1667 5.1 16.8 5.6 16.55C6.6 16.05 7.6375 15.6667 8.7125 15.4C9.7875 15.1333 10.8833 15 12 15C13.1167 15 14.2125 15.1333 15.2875 15.4C16.3625 15.6667 17.4 16.05 18.4 16.55C18.9 16.8 19.2917 17.1667 19.575 17.65C19.8583 18.1333 20 18.6583 20 19.225V21H4ZM5.5 19.5H18.5C18.5 19.1667 18.4375 18.8542 18.3125 18.5625C18.1875 18.2708 17.9833 18.05 17.7 17.9C16.8 17.4667 15.875 17.125 14.925 16.875C13.975 16.625 13 16.5 12 16.5C11 16.5 10.025 16.625 9.075 16.875C8.125 17.125 7.2 17.4667 6.3 17.9C6.01667 18.05 5.8125 18.2708 5.6875 18.5625C5.5625 18.8542 5.5 19.1667 5.5 19.5Z" fill="black"/>
        </svg>
        `,
      ],
      [
        'background_replace_off',
        `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.974976 3.1L21.2 23.325L22.25 22.275L5.47498 5.5L3.97498 4L2.02498 2.05L0.974976 3.1Z" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 4.72499L3.8625 3.86249L4.925 4.925L3 6.84999V4.72499ZM6.85 2.99999L5.975 3.87499L5.1 2.99999H6.85ZM7.0375 4.9375L8.1 6L11.1 2.99999H8.975L7.0375 4.9375ZM10.2756 8.17563L9.22537 7.12537C9.9986 6.37512 10.9235 5.99999 12 5.99999C13.1 5.99999 14.0417 6.39166 14.825 7.17499C15.6083 7.95833 16 8.9 16 10C16 11.0765 15.6249 12.0014 14.8746 12.7746L13.8244 11.7244C14.2748 11.2505 14.5 10.6757 14.5 10C14.5 9.3 14.2583 8.70833 13.775 8.22499C13.2917 7.74166 12.7 7.49999 12 7.49999C11.3243 7.49999 10.7495 7.7252 10.2756 8.17563ZM16.6125 13C16.4241 13.307 16.1977 13.5848 15.9334 13.8334L16.2011 14.1011C16.2384 14.1131 16.2756 14.1252 16.3125 14.1375C16.4875 14.1958 16.6667 14.25 16.85 14.3L21 10.15V7.99999L17.175 11.825C17.025 12.2417 16.8375 12.6333 16.6125 13ZM15.4382 15.4382C15.3881 15.4252 15.3378 15.4125 15.2875 15.4C14.2125 15.1333 13.1167 15 12 15C10.8833 15 9.7875 15.1333 8.7125 15.4C7.6375 15.6667 6.6 16.05 5.6 16.55C5.1 16.8 4.70833 17.1667 4.425 17.65C4.14167 18.1333 4 18.6583 4 19.225V21H20V20L15.4382 15.4382ZM13.653 13.653L12.4622 12.4622C12.3138 12.4874 12.1597 12.5 12 12.5C11.3 12.5 10.7083 12.2583 10.225 11.775C9.74167 11.2917 9.5 10.7 9.5 10C9.5 9.84027 9.51258 9.68619 9.53775 9.53774L8.34698 8.34698C8.11566 8.85123 8 9.40223 8 10C8 11.1 8.39167 12.0417 9.175 12.825C9.95833 13.6083 10.9 14 12 14C12.5978 14 13.1488 13.8843 13.653 13.653ZM7.05 7.05L5.9875 5.98749L3.1 8.87499V11L7.05 7.05ZM15.65 5.88749C15.8333 6.06249 16.0083 6.24166 16.175 6.42499L19.6 2.99999H17.475L15.05 5.42499C15.2667 5.55833 15.4667 5.71249 15.65 5.88749ZM7.425 13.05L5.5 14.975C5.86667 14.8083 6.23333 14.65 6.6 14.5C6.96667 14.35 7.34167 14.2167 7.725 14.1L8.2 13.975C8.05 13.8417 7.9125 13.7 7.7875 13.55C7.6625 13.4 7.54167 13.2333 7.425 13.05ZM17.3 8.54999C17.3667 8.83333 17.4167 9.12499 17.45 9.42499L21 5.87499V3.72499L17 7.72499C17.1333 7.99166 17.2333 8.26666 17.3 8.54999ZM13.225 2.99999L11.725 4.49999H12C12.2833 4.49999 12.5542 4.52083 12.8125 4.56249C13.0708 4.60416 13.3333 4.66666 13.6 4.74999L15.35 2.99999H13.225ZM3 13.25V15.375L6.75 11.6C6.65 11.35 6.58333 11.0917 6.55 10.825C6.51667 10.5583 6.5 10.2833 6.5 10V9.74999L3 13.25ZM19.1 15.2C19.3333 15.3167 19.55 15.4667 19.75 15.65L21 14.4V12.275L18.4 14.875C18.6333 14.975 18.8667 15.0833 19.1 15.2ZM18.3125 18.5625C18.4375 18.8542 18.5 19.1667 18.5 19.5H5.5C5.5 19.1667 5.5625 18.8542 5.6875 18.5625C5.8125 18.2708 6.01667 18.05 6.3 17.9C7.2 17.4667 8.125 17.125 9.075 16.875C10.025 16.625 11 16.5 12 16.5C13 16.5 13.975 16.625 14.925 16.875C15.875 17.125 16.8 17.4667 17.7 17.9C17.9833 18.05 18.1875 18.2708 18.3125 18.5625Z" fill="black"/>
        </svg>
        `,
      ],
    ]

    for (const [name, icon] of ICONS) {
      iconRegistry.addSvgIconLiteral(
        name,
        sanitizer.bypassSecurityTrustHtml(icon)
      )
    }
  }
}
