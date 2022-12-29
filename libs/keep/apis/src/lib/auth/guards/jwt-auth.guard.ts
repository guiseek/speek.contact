import {ExecutionContext, Injectable} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'
import {Reflector} from '@nestjs/core'
import {IS_ALLOWED_KEY} from '@speek/keep/utils'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const targets = [context.getHandler(), context.getClass()]

    const isAllowed = this.reflector.getAllAndOverride<boolean>(
      IS_ALLOWED_KEY,
      targets
    )

    if (isAllowed) {
      return true
    }

    return super.canActivate(context)
  }
}
