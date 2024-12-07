import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/modules/auth/guards/authorization.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { IUser } from 'src/shared/contracts/entity/user';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthorizationGuard)
export class UserController {
  constructor() { }

  @Get('profile')
  @ApiOperation({ summary: 'Get the currently logged-in user profile' })
  async getProfile(@CurrentUser() user: IUser) {
    return user;
  }
}
