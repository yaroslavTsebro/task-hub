import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Project } from './project';
import { User } from './user';

export enum UserProjectRole {
  OWNER='OWNER',
  WORKER='WORKER',
  ADMIN='ADMIN',
  VIEWER='VIEWER',
}

export type UserProjectDocument = UserProject & Document;

@Schema({ timestamps: true })
export class UserProject {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Project.name, required: true })
  projectId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: UserProjectRole, 
    default: UserProjectRole.WORKER 
  })
  role: UserProjectRole;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);
