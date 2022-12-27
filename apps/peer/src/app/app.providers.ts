import {LOCALE_ID, Provider, ValueProvider} from '@angular/core'
import {registerLocaleData} from '@angular/common'
import pt from '@angular/common/locales/pt'
import ptBr from '@angular/common/locales/extra/br'

registerLocaleData(pt, 'pt-BR', ptBr)

const localeProvider: ValueProvider = {provide: LOCALE_ID, useValue: 'pt-BR'}

export const appProviders: Provider[] = [localeProvider]
