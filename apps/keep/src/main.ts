import {Logger} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {AppLogger} from './app/app.logger'
import {AppModule} from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: new AppLogger()})
  await app.listen(process.env.PORT || 3333, async () => {
    Logger.log(`Listening at ${await app.getUrl()}`)
  })
}

bootstrap()
