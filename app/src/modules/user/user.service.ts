import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../data/repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) { throw new NotFoundException('User not found'); }

    return user;
  }
}
