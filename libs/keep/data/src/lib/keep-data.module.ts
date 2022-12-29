import {Module, Global} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {DATA_PROVIDERS} from './data.providers'
import {AUTH_PROVIDERS} from './auth/auth.providers'
import {USER_PROVIDERS} from './user/user.providers'

@Global()
@Module({
  imports: [JwtModule],
  providers: [...DATA_PROVIDERS, ...USER_PROVIDERS, ...AUTH_PROVIDERS],
  exports: [...DATA_PROVIDERS, ...USER_PROVIDERS, ...AUTH_PROVIDERS],
})
export class KeepDataModule {}
