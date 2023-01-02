import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {WsException} from '@nestjs/websockets'
import {Reflector} from '@nestjs/core'
import {IS_ALLOWED_KEY} from '@speek/keep/utils'
import {PeerMessage} from '@speek/type'
import {isValid} from '@speek/utils'

@Injectable()
export class SignalingGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
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
    console.log(isValid(user))
    if (!meet) throw new WsException('Missing meet.')
    if (!isValid(user)) throw new WsException('Invalid user.')

    return meet && isValid(user)
  }
}
