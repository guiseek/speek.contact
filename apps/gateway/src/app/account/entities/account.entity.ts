import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({
  autoCreate: true,
  timestamps: {
    createdAt: 'dateCreated'
  }
})
export class Account {}
