import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from './project';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Project.name, required: true })
  projectId: Types.ObjectId;

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.OPEN
  })
  status: TaskStatus;

  @Prop({ required: false, type: Date })
  startDate?: Date;

  @Prop({ required: false, type: Date })
  endDate?: Date;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task);
