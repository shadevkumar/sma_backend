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

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  //send follow request to a user
  @UseGuards(JwtAuthGuard)
  @Post('request/:followingId')
  async sendFollowRequest(
    @Param('followingId') followingId: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    console.log('userid and followingId', userId, followingId);
    return this.followService.sendFollowRequest(userId, followingId);
  }

  //accept follow request from a user
  @UseGuards(JwtAuthGuard)
  @Post('accept/:followId')
  async acceptFollowRequest(@Param('followId') followId: string) {
    console.log('Inside accept');
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
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    return this.followService.unfollow(userId, followingId);
  }

  //get users who are unfollowed by current user
  @UseGuards(JwtAuthGuard)
  @Get('unfollowed')
  async getUnfollowedUsers(@Request() req: any) {
    const userId = req.user.sub;
    return this.followService.getUnfollowedUsers(userId);
  }

  //get followings of current users 
  @UseGuards(JwtAuthGuard)
  @Get('followed')
  async getFollowedUsers(@Request() req: any) {
    const userId = req.user.sub;
    return this.followService.getFollowedUsers(userId);
  }

  //get follow requests of users for current user
  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async getFollowRequests(@Request() req: any) {
    const userId = req.user.sub;
    return this.followService.getFollowRequests(userId);
  }
}
