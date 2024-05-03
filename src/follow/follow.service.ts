import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowDocument, FollowStatus } from './schemas/follow.schema';
import { isValidObjectId, Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Inject the User model
  ) {}

  async sendFollowRequest(
    followerId: string,
    followingId: string,
  ): Promise<Follow> {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }
    const existingFollow = await this.followModel.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      throw new Error(
        'Follow request already sent or connection already exists',
      );
    }

    const newFollow = new this.followModel({
      follower: followerId,
      following: followingId,
      status: FollowStatus.Pending,
    });

    return newFollow.save();
  }

  async acceptFollowRequest(followId: string): Promise<Follow> {
    const updatedFollow = await this.followModel.findByIdAndUpdate(
      followId,
      { $set: { status: FollowStatus.Accepted } },
      { new: true }, // Return the modified document rather than the original
    );

    if (!updatedFollow) {
      throw new Error('Follow request not found or already accepted');
    }

    console.log('Updated Follow:', updatedFollow);
    return updatedFollow;
  }

  async rejectFollowRequest(followId: string): Promise<Follow> {
    return this.followModel.findByIdAndDelete(followId);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.followModel.deleteOne({
      follower: followerId,
      following: followingId,
    });
  }

  async findAllFollowingIds(userId: string): Promise<string[]> {
    try {
      const follows = await this.followModel.find({ follower: userId }).exec();
      return follows.map((follow) => follow.following.toString());
    } catch (error) {
      console.error('Error fetching following IDs:', error);
      throw error;
    }
  }

  async getFollowRequests(currentUserId: string): Promise<User[]> {
    const requests = await this.followModel
      .find({
        following: currentUserId,
        status: FollowStatus.Pending,
      })
      .populate({
        path: 'follower',
        select: '_id username',
      })
      .exec();

    return requests.map(
      (req) =>
        ({
          followId: req._id,
          follower: req.follower,
        }) as any as User,
    );
  }

  async getFollowedUsers(currentUserId: string): Promise<User[]> {
    const follows = await this.followModel
      .find({
        follower: currentUserId,
        status: FollowStatus.Accepted,
      })
      .populate({path:'following',select: '_id username'})
      .exec();

    return follows.map((follow) => follow.following as any as User);
  }

  async getUnfollowedUsers(currentUserId: string): Promise<User[]> {
    const followedOrPendingUsers = await this.followModel
      .find({
        follower: currentUserId,
        status: { $in: [FollowStatus.Accepted, FollowStatus.Pending] },
      })
      .select('following -_id');

    console.log('Fetched Followed or Pending Users:', followedOrPendingUsers);

    // Filter out any undefined or invalid entries
    const followedOrPendingUserIds = followedOrPendingUsers
      .map((follow) => follow.following)
      .filter((following) => isValidObjectId(following));

    console.log('Filtered User IDs:', followedOrPendingUserIds);

    // If no valid user IDs are found, return all users except the current user
    if (followedOrPendingUserIds.length === 0) {
      console.log(
        'No valid followed or pending user IDs found. Returning all users except the current user.',
      );
      return this.userModel
        .find({
          _id: { $ne: currentUserId },
        })
        .select('_id username');
    }

    // Otherwise, return users not followed or pending
    return this.userModel
      .find({
        _id: { $nin: [...followedOrPendingUserIds, currentUserId] },
      })
      .select('_id username');
  }
}
