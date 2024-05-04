import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FollowService } from './follow.service';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  //send follow request to a user
  @UseGuards(JwtAuthGuard)
  @Post('request/:followingId')
  async sendFollowRequest(
    @Param('followingId') followingId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.followService.sendFollowRequest(userId, followingId);
  }

  //accept follow request from a user
  @UseGuards(JwtAuthGuard)
  @Post('accept/:followId')
  async acceptFollowRequest(@Param('followId') followId: string) {
    return this.followService.acceptFollowRequest(followId);
  }

  //reject follow request of a user
  @UseGuards(JwtAuthGuard)
  @Post('reject/:followId')
  async rejectFollowRequest(@Param('followId') followId: string) {
    return this.followService.rejectFollowRequest(followId);
  }

  //unfollow a user
  @UseGuards(JwtAuthGuard)
  @Delete(':followingId')
  async unfollow(
    @Param('followingId') followingId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.followService.unfollow(userId, followingId);
  }

  //get users who are unfollowed by current user
  @UseGuards(JwtAuthGuard)
  @Get('unfollowed')
  async getUnfollowedUsers(@GetUser('sub') userId: string) {
    return this.followService.getUnfollowedUsers(userId);
  }

  //get followings of current users
  @UseGuards(JwtAuthGuard)
  @Get('followed')
  async getFollowedUsers(@GetUser('sub') userId: string) {
    return this.followService.getFollowedUsers(userId);
  }

  //get follow requests of users for current user
  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async getFollowRequests(@GetUser('sub') userId: string) {
    return this.followService.getFollowRequests(userId);
  }
}
