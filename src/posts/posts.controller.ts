import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowService } from 'src/follow/follow.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly followService: FollowService,
  ) {}

  //create post
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    createPostDto: {
      title: string;
      description: string;
      authorId: string;
    },
  ) {
    console.log('Creating post with data:', createPostDto);
    try {
      const newPost = await this.postsService.create(createPostDto);
      return newPost;
    } catch (error) {
      console.error('Error while creating post:', error);
      throw error;
    }
  }

//get posts of a user
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByAuthorId(@Request() req) {
    const authorId = req.user.sub; 
    console.log('Fetching all posts for authorId:', authorId);
    try {
      const posts = await this.postsService.findAllByAuthorId(authorId);
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  //get posts of users followed by current user
  @UseGuards(JwtAuthGuard)
  @Get('following')
  async findAllFollowingPosts(@Request() req) {
    const userId = req.user.sub;
    try {
      const followingIds = await this.followService.findAllFollowingIds(userId);
      const posts = await this.postsService.findAllByAuthorsIds(followingIds);
      return posts;
    } catch (error) {
      console.error('Error fetching following posts:', error);
      throw error;
    }
  }
}
