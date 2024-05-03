import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    JwtModule,
    UsersModule
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports:[FollowService]
})
export class FollowModule {}
