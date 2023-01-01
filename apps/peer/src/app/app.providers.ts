import {Provider, LOCALE_ID} from '@angular/core'
import {registerLocaleData} from '@angular/common'
import pt from '@angular/common/locales/pt'
import ptBr from '@angular/common/locales/extra/br'
import {env} from '../envs/env'
import {
  Peer,
  PeerImpl,
  Signaling,
  UserService,
  AuthService,
  AuthFacade,
  AuthFacadeImpl,
  SignalingImpl,
  AuthServiceImpl,
  UserServiceImpl,
  StorageService,
  AuthInterceptor,
} from '@speek/peer/data'
import {HttpService} from '@speek/type'
import {HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http'

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
  provide: Signaling,
  useFactory: (url: string) => new SignalingImpl(url),
  deps: ['gateway.url'],
}

const peerProvider = {
  provide: Peer,
  useFactory: (
    configuration: RTCConfiguration,
    signaling: Signaling,
    constraints: MediaStreamConstraints
  ) => new PeerImpl(configuration, signaling, constraints),
  deps: ['peer.configuration', Signaling, 'peer.constraints'],
}

const httpProvider = {
  provide: HttpService,
  useClass: HttpClient,
}

const authProvider = {
  provide: AuthService,
  useFactory: (httpService: HttpService) => new AuthServiceImpl(httpService),
  deps: [HttpService],
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

const userProvider = {
  provide: UserService,
  useFactory: (httpService: HttpService) => new UserServiceImpl(httpService),
  deps: [HttpService],
}

export const appProviders: Provider[] = [
  localStorageProvider,
  storageProvider,
  localeProvider,
  configurationProvider,
  constraintsProvider,
  gatewayProvider,
  signalingProvider,
  peerProvider,
  httpProvider,
  authProvider,
  authInterceptorProvider,
  authFacadeProvider,
  userProvider,
]
