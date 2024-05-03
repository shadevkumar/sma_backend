import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { User, UserSchema } from './users/schemas/user.schema';
import { ProtectedController } from './protected.controller';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';
import { FollowModule } from './follow/follow.module';
import { FollowController } from './follow/follow.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    FollowModule,
  ],
  controllers: [
    AppController,
    ProtectedController,
    PostsController,
    FollowController,
  ],
  providers: [AppService, UsersService],
})
export class AppModule {}
