import { Touch, TouchDocument } from './entities/touch.schema';
import { CreateTouchDto } from './dto/create-touch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Touch.name)
    private touchModel: Model<TouchDocument>
  ) { }

  async create(createTouchDto: CreateTouchDto): Promise<Touch> {
    const createdTouch = new this.touchModel(createTouchDto);
    return createdTouch.save();
  }
}
