import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: any) {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: any): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  async refreshTokens(@Body() body: { refreshToken: string }) {
    try {
      const newTokens = await this.authService.refreshTokens(body.refreshToken);
      return newTokens;
    } catch (e) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    await this.authService.logout(body.userId);
    return { message: 'Logged out successfully' };
  }
}
