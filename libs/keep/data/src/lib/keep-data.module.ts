import {Module, Global} from '@nestjs/common'
import {KEEP_DATA_PROVIDERS} from './keep-data.providers'

@Global()
@Module({
  providers: KEEP_DATA_PROVIDERS,
  exports: KEEP_DATA_PROVIDERS,
})
export class KeepDataModule {}
