import {
  LOCALE_ID,
  Provider,
  ValueProvider,
  FactoryProvider,
} from '@angular/core'
import {registerLocaleData} from '@angular/common'
import pt from '@angular/common/locales/pt'
import ptBr from '@angular/common/locales/extra/br'
import {env} from '../envs/env'
import {Peer, PeerImpl, Signaling, SignalingImpl} from '@speek/peer/data'

registerLocaleData(pt, 'pt-BR', ptBr)

const localeProvider: ValueProvider = {provide: LOCALE_ID, useValue: 'pt-BR'}

const configurationProvider: ValueProvider = {
  provide: 'peer.configuration',
  useValue: env.configuration,
}

const constraintsProvider: ValueProvider = {
  provide: 'peer.constraints',
  useValue: env.constraints,
}

const gatewayProvider: ValueProvider = {
  provide: 'gateway.url',
  useValue: env.gateway.url,
}

const signalingProvider: FactoryProvider = {
  provide: Signaling,
  useFactory: (url: string) => new SignalingImpl(url),
  deps: ['gateway.url'],
}

const peerProvider: FactoryProvider = {
  provide: Peer,
  useFactory: (
    configuration: RTCConfiguration,
    signaling: Signaling,
    constraints: MediaStreamConstraints
  ) => new PeerImpl(configuration, signaling, constraints),
  deps: ['peer.configuration', Signaling, 'peer.constraints'],
}

export const appProviders: Provider[] = [
  localeProvider,
  configurationProvider,
  constraintsProvider,
  gatewayProvider,
  signalingProvider,
  peerProvider,
]
