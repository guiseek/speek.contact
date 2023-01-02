import {Module} from '@nestjs/common'

import {KeepDataModule} from '@speek/keep/data'
import {KeepApisModule} from '@speek/keep/apis'

@Module({
  imports: [KeepDataModule, KeepApisModule],
})
export class AppModule {}
