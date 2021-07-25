import { AnalyticsModule } from './analytics/analytics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { dbConfig } from './config/database';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AnalyticsModule, MongooseModule.forRoot(dbConfig), UsersModule, AccountModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
