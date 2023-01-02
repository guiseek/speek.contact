import {Strategy} from 'passport-local'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {ContextIdFactory, ModuleRef} from '@nestjs/core'
import {AuthService} from '@speek/keep/data'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
    })
  }

  async validate(request: Request, username: string, password: string) {
    const contextId = ContextIdFactory.getByRequest(request)
    const authService = await this.moduleRef.resolve(AuthService, contextId)
    const user = await authService.validateUser({
      username,
      password,
    })
    if (!user) {
      throw new UnauthorizedException(`Usuário não encontrado ou a senha está incorreta`)
    }
    return user
  }
}
