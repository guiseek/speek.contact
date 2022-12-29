import {LoggerService, ConsoleLogger} from '@nestjs/common'
import {env} from '../envs/env'

export class AppLogger extends ConsoleLogger implements LoggerService {
  context: string

  setContext(context: string) {
    this.context = context
  }

  log<T>(message: T, context?: string) {
    super.log(message, context ? context : this.context)
  }
  error<T>(message: T, trace?: string, context?: string) {
    super.error(message, context ? context : this.context)
  }
  warn<T>(message: T, context?: string) {
    super.warn(message, context ? context : this.context)
  }
  debug<T>(message: T, context?: string) {
    if (!env.production) {
      super.debug(message, context ? context : this.context)
    }
  }
  verbose<T>(message: T, context?: string) {
    super.verbose(message, context ? context : this.context)
  }
}
