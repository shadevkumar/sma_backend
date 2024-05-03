import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    console.log('user from create', createdUser);

    return createdUser.save();
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('_id username').exec();
  }

  async setRefreshToken(refreshToken: string, userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    console.log('user from setRefreshToken', user);
    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = refreshToken;
    await user.save();
  }

  async removeRefreshToken(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.refreshToken = undefined; // Remove the refresh token
    await user.save();
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.userModel.findById(userId).exec();
  }
}
