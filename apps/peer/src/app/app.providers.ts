import {HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http'
import {MAT_DATE_LOCALE} from '@angular/material/core'
import {Provider, LOCALE_ID} from '@angular/core'
import {registerLocaleData} from '@angular/common'
import pt from '@angular/common/locales/pt'
import ptBr from '@angular/common/locales/extra/br'
import {HttpService} from '@speek/type'
import {env} from '../envs/env'
import {
  Peer,
  PeerImpl,
  Signaling,
  UserService,
  AuthService,
  AuthFacade,
  AuthFacadeImpl,
  MediaService,
  MediaState,
  MediaFacade,
  MediaFacadeImpl,
  SignalingImpl,
  AuthServiceImpl,
  MediaServiceImpl,
  UserServiceImpl,
  StorageService,
  AuthInterceptor,
  UserFacade,
  UserFacadeImpl,
  SignalingService,
  SignalingServiceImpl,
  PeerFacade,
  PeerFacadeImpl,
} from '@speek/peer/data'
import {Platform} from '@speek/utils'

registerLocaleData(pt, 'pt-BR', ptBr)

const localStorageProvider = {
  provide: Storage,
  useValue: localStorage,
}
const storageProvider = {
  provide: StorageService,
  useClass: StorageService,
  deps: [Storage],
}

const localeProvider = {provide: LOCALE_ID, useValue: 'pt-BR'}
const dateLocaleProvider = {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}

const platformProvider = {
  provide: Platform,
  useFactory: () => new Platform('browser'),
}

const configurationProvider = {
  provide: 'peer.configuration',
  useValue: env.configuration,
}

const constraintsProvider = {
  provide: 'peer.constraints',
  useValue: env.constraints,
}

const gatewayProvider = {
  provide: 'gateway.url',
  useValue: env.gateway.url,
}

const signalingProvider = {
  provide: SignalingService,
  useFactory: (url: string) => new SignalingServiceImpl(url),
  deps: ['gateway.url'],
}
// const signalingProvider = {
//   provide: Signaling,
//   useFactory: (url: string) => new SignalingImpl(url),
//   deps: ['gateway.url'],
// }

const peerProvider = {
  provide: PeerFacade,
  useFactory: (configuration: RTCConfiguration, signaling: SignalingService) =>
    new PeerFacadeImpl(configuration, signaling),
  deps: ['peer.configuration', SignalingService],
}
// const peerProvider = {
//   provide: Peer,
//   useFactory: (
//     configuration: RTCConfiguration,
//     signaling: Signaling,
//     constraints: MediaStreamConstraints
//   ) => new PeerImpl(configuration, signaling, constraints),
//   deps: ['peer.configuration', Signaling, 'peer.constraints'],
// }

const httpProvider = {
  provide: HttpService,
  useClass: HttpClient,
}

const authProvider = {
  provide: AuthService,
  useFactory: (httpService: HttpService) => new AuthServiceImpl(httpService),
  deps: [HttpService],
}

const mediaProvider = {
  provide: MediaService,
  useFactory: (
    storageService: StorageService<Omit<MediaState, 'stream'>>,
    platform: Platform
  ) => new MediaServiceImpl(storageService, platform),
  deps: [StorageService, Platform],
}

const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  deps: [StorageService],
  multi: true,
}

const authFacadeProvider = {
  provide: AuthFacade,
  useFactory: (authService: AuthService, storageService: StorageService) =>
    new AuthFacadeImpl(authService, storageService),
  deps: [AuthService, StorageService],
}

const mediaFacadeProvider = {
  provide: MediaFacade,
  useFactory: (authService: MediaService) => new MediaFacadeImpl(authService),
  deps: [MediaService],
}

const userProvider = {
  provide: UserService,
  useFactory: (httpService: HttpService) => new UserServiceImpl(httpService),
  deps: [HttpService],
}

const userFacadeProvider = {
  provide: UserFacade,
  useFactory: (userService: UserService) => new UserFacadeImpl(userService),
  deps: [UserService],
}

export const appProviders: Provider[] = [
  localStorageProvider,
  storageProvider,
  localeProvider,
  dateLocaleProvider,
  configurationProvider,
  constraintsProvider,
  platformProvider,
  gatewayProvider,
  signalingProvider,
  peerProvider,
  httpProvider,
  authProvider,
  authInterceptorProvider,
  authFacadeProvider,
  mediaProvider,
  mediaFacadeProvider,
  userProvider,
  userFacadeProvider,
]
