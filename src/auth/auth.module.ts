import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    {
      provide: 'refreshToken',
      useFactory: async (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          signOptions: { expiresIn: '7d' },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
