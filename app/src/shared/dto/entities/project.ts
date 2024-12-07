import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
