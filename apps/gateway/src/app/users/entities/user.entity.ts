import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  autoCreate: true,
  timestamps: {
    createdAt: 'dateCreated'
  }
})
export class User {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: Date })
  dateCreated: Date;

  @Prop({ type: Date })
  lastLogin: Date;

  @Prop({ type: String })
  permission: string;

  @Prop({ type: String })
  pushToken: string;

  accountId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
