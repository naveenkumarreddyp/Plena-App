import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class UserOperationsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async blockUser(userId: string, blockUserId: string): Promise<any> {
    const user = await this.userModel.findOne({ userid: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.updateOne(
      { userid: userId },
      { $addToSet: { blockedusers: blockUserId } },
    ).exec();
  }

  async unblockUser(userId: string, unblockUserId: string): Promise<any> {
    const user = await this.userModel.findOne({ userid: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.updateOne(
      { userid: userId },
      { $pull: { blockedusers: unblockUserId } },
    ).exec();
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const user = await this.userModel.findOne({ userid: userId }).populate('blockedusers').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.find({ userid: { $in: user.blockedusers } }).exec();
  }

  async getUnblockedUsers(userId: string): Promise<User[]> {
    const user = await this.userModel.findOne({ userid: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const blockedUserIds = user.blockedusers;
    return this.userModel.find({ userid: { $nin: blockedUserIds } }).exec();
  }
}
