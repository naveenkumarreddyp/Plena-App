import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserOperationsService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async blockUser(userId: string, blockUserId: string): Promise<any> {
    const user = await this.userModel.findOne({ userid: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (userId === blockUserId) {
      throw new ConflictException('You cant block yourself');
    }
    const tobeblockeduser = await this.userModel.findOne({
      userid: blockUserId,
    });
    if (!tobeblockeduser) {
      throw new NotFoundException(
        'The user that you are trying to block not found',
      );
    }
    return this.userModel
      .updateOne(
        { userid: userId },
        { $addToSet: { blockedusers: blockUserId } },
      )
      .exec();
  }

  async unblockUser(userId: string, unblockUserId: string): Promise<any> {
    const user = await this.userModel.findOne({ userid: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (userId === unblockUserId) {
      throw new ConflictException('You cant block or unblock yourself');
    }
    const tobeunblockeduser = await this.userModel.findOne({
      userid: unblockUserId,
    });
    if (!tobeunblockeduser) {
      throw new NotFoundException(
        'The user that you are trying to unblock not found',
      );
    }
    return this.userModel
      .updateOne({ userid: userId }, { $pull: { blockedusers: unblockUserId } })
      .exec();
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const user = await this.userModel.findOne({ userid: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel
      .find({ userid: { $in: user.blockedusers } })
      .select('-password -__v -_id -blockedusers -createdAt -updatedAt')
      .lean()
      .exec();
  }

  async getUnblockedUsers(userId: string): Promise<User[]> {
    const user = await this.userModel.findOne({ userid: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const blockedUserIds = user.blockedusers;
    return this.userModel
      .find({ userid: { $nin: blockedUserIds.concat(user.userid) } })
      .select('-password -__v -_id -blockedusers -createdAt -updatedAt')
      .lean()
      .exec();
  }
}
