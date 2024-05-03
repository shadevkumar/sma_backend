import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProtectedData(@Request() req) {
    // This route will only be accessible with a valid JWT token
    return { message: 'This is a protected route', user: req.user };
  }
}