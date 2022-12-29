import {Logger} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import {AppLogger} from './app/app.logger'
import {AppModule} from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: new AppLogger()})

  const config = new DocumentBuilder()
    .setTitle('SKA')
    .setDescription('The Speek Keep API')
    .setVersion('1.0')
    .addTag('keep')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 3333, async () => {
    Logger.log(`Listening at ${await app.getUrl()}`)
  })
}

bootstrap()
