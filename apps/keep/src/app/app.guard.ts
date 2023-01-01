import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {WsException} from '@nestjs/websockets'
import {Reflector} from '@nestjs/core'
import {PeerMessage} from '@speek/type'
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

  hasCall({meet, user}: PeerMessage) {
    console.log(meet, user)

    if (!meet || !isValid(meet)) throw new WsException('Missing meet.')
    return !!meet
  }
}
