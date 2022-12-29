import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {WsException} from '@nestjs/websockets'
import {Reflector} from '@nestjs/core'
import {SignalMessage} from '@speek/peer/data'
import {isValid} from '@speek/peer/utils'
import {Observable} from 'rxjs'
import {IS_ALLOWED_KEY} from './allowed.decorator'

@Injectable()
export class SignalingGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_ALLOWED_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return this.hasCall(context.switchToWs().getData())
  }

  hasCall({call, user}: SignalMessage) {
    console.log(call, user)

    if (!call || !isValid(call)) throw new WsException('Missing call.')
    return !!call
  }
}
