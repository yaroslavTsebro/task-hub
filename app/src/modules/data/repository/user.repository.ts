import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/shared/dto/entities/user';
import { UserDao } from '../dao/user.dao';
import { IUser } from 'src/shared/contracts/entity/user';

@Injectable()
export class UserRepository {
  constructor(private readonly userDao: UserDao) {}

  async create(email: string, name: string, passwordHash: string): Promise<IUser> {
    const user = await this.userDao.create(email, name, passwordHash);
    return this.mapToDomain(user);
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.userDao.findById(id);
    return user ? this.mapToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.userDao.findByEmail(email);
    return user ? this.mapToDomain(user) : null;
  }

  private mapToDomain(doc: UserDocument): IUser {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
