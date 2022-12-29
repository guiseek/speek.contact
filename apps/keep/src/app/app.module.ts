import {Module} from '@nestjs/common'

import {AppController} from './app.controller'
import {AppService} from './app.service'
import {AppGateway} from './app.gateway'
import {KeepDataModule} from '@speek/keep/data'
import { KeepApisModule } from '@speek/keep/apis'

@Module({
  imports: [KeepDataModule, KeepApisModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
