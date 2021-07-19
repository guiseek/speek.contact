import { AnalyticsModule } from './analytics/analytics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { dbConfig } from './config/database';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';


@Module({
  imports: [
    AnalyticsModule,
    MongooseModule.forRoot(dbConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
