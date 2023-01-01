import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {authConfig} from '../../config/auth'
import {AuthPayload} from '@speek/type'
import {AuthUserResponseDto} from '@speek/keep/data'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    })
  }

  async validate({sub, email, displayName}: AuthPayload) {
    return new AuthUserResponseDto(sub, email, displayName)
  }
}
