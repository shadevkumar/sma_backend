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

  @UseGuards(JwtAuthGuard)
  @Post('accept/:followId')
  async acceptFollowRequest(@Param('followId') followId: string) {
    console.log('Inside accept');
    return this.followService.acceptFollowRequest(followId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject/:followId')
  async rejectFollowRequest(@Param('followId') followId: string) {
    return this.followService.rejectFollowRequest(followId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':followingId')
  async unfollow(
    @Param('followingId') followingId: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    return this.followService.unfollow(userId, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unfollowed')
  async getUnfollowedUsers(@Request() req: any) {
    const userId = req.user.sub;
    console.log('userid from unfollowed', userId);
    return this.followService.getUnfollowedUsers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followed')
  async getFollowedUsers(@Request() req: any) {
    const userId = req.user.sub;
    return this.followService.getFollowedUsers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async getFollowRequests(@Request() req: any) {
    const userId = req.user.sub;
    console.log('Userid from /follow/requests', userId);
    return this.followService.getFollowRequests(userId);
  }
}
