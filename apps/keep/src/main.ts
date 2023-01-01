import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common'
import {NestFactory, Reflector} from '@nestjs/core'
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger'
import {AppLogger} from './app/app.logger'
import {AppModule} from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: new AppLogger()})
  app.setGlobalPrefix('keep')

  const config = new DocumentBuilder()
    .setTitle('SKA')
    .setDescription('The Speek Keep API')
    .setVersion('1.0')
    .addTag('keep')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  )

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  await app.listen(process.env.PORT || 3333, async () => {
    Logger.log(`Listening at ${await app.getUrl()}`)
  })
}

bootstrap()
