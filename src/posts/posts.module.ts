import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtModule } from '@nestjs/jwt';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule,
    FollowModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
