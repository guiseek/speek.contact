import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TouchDocument = Touch & Document;

@Schema()
export class Touch {
  @Prop({ type: Number })
  mailing: number;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: Object })
  headers: Object;
}

export const TouchSchema = SchemaFactory.createForClass(Touch);
