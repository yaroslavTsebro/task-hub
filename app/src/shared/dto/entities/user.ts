import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User);
