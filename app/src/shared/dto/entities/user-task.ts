import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Task } from './task';
import { User } from './user';

export enum UserTaskStatus {
  PERFORMER = 'PERFORMER',
  OBSERVER = 'OBSERVER',
  ASSISTANT = 'ASSISTANT',
}

export type UserTaskDocument = UserTask & Document;

@Schema({ timestamps: true })
export class UserTask {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Task.name, required: true })
  taskId: Types.ObjectId;

  @Prop({
    type: String,
    enum: UserTaskStatus,
    default: UserTaskStatus.PERFORMER
  })
  role: UserTaskStatus;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const UserTaskSchema = SchemaFactory.createForClass(UserTask);