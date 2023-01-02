import {Module} from '@nestjs/common'
import {APP_GUARD} from '@nestjs/core'
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import {AUTH_PROVIDERS, MEET_PROVIDERS, KeepDataModule} from '@speek/keep/data'
import {AuthController} from './auth/auth.controller'
import {JwtAuthGuard} from './auth/guards/jwt-auth.guard'
import {JwtStrategy, LocalStrategy} from './auth/strategies'
import {UserController} from './user/user.controller'
import {authConfig} from './config/auth'
import {MeetGateway} from './meet/meet.gateway'

@Module({
  imports: [
    KeepDataModule,
    PassportModule,
    JwtModule.register({
      secret: authConfig.secret,
      signOptions: {expiresIn: '24h'},
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    ...MEET_PROVIDERS,
    MeetGateway,
    LocalStrategy,
    JwtStrategy,
    ...AUTH_PROVIDERS,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class KeepApisModule {}
