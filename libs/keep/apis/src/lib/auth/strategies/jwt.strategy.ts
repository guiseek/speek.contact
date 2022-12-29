import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {AuthPayload} from '@speek/keep/data'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {authConfig} from '../../config/auth'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    })
  }

  async validate(payload: AuthPayload) {
    return {id: payload.sub, username: payload.username}
  }
}
