import {
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JWTGuard } from '../auth/guard/jwt.guard';
import { User } from '@prisma/client';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser('id') user: User) {
    return user;
  }

  @Patch()
  editUser() {}
}
