import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
//because we used index.ts (barell export pattern.)
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  //you should not use request straight in here
  //we need to have DTO (and obj) to transdfer data in it.
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
