import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { UsersDocument } from './users/model/users.schema';
import { CurrentUser } from '@app/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth-guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UsersDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
