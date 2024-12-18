import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/shared/dto/entities/user';

@Injectable()
export class UserDao {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(email: string, name: string, passwordHash: string): Promise<UserDocument> {
    const user = new this.userModel({ email, name, passwordHash });
    return user.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    const objectId = new Types.ObjectId(id);
    return this.userModel.findById(objectId).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
