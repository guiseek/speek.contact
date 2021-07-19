import { Controller, Get, Query, Headers } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  findAll(
    @Headers() headers: Headers,
    @Query('timestamp') date: Date,
    @Query('mailing') mailing: number
  ) {
    return this.analyticsService.create({ headers, date, mailing });
  }
}
