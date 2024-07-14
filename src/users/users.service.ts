import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AddUserDto } from './dto/addUser.dto';
import { parseStringToDate } from 'src/utils/common.helper';
import { QueryParams, User } from './schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Adding User
  async addUser(userInfo: AddUserDto): Promise<User> {
    let cachedUsername = await this.cacheManager.get<string>(userInfo.username);
    if (cachedUsername) {
      throw new ConflictException('Username already taken');
    }
    const user = await this.userModel.findOne({ username: userInfo.username });
    if (user) {
      await this.cacheManager.set(userInfo.username, 'taken');
      throw new ConflictException('Username already taken');
    }
    const dateOfBirth = parseStringToDate(userInfo.dateofbirth);
    const newUser = new this.userModel({
      username: userInfo.username,
      password: userInfo.password,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      dateOfBirth: dateOfBirth,
    });
    await this.cacheManager.set(userInfo.username, 'taken');
    return newUser.save();
  }

  // Get All Users

  async getAllUsers(query: QueryParams): Promise<User[]> {
    let resPerPage = Number(query.limit) || 10;
    let currentPage = Number(query.page) || 1;
    let skip = Number(query.skip) || resPerPage * (currentPage - 1);
    let keyword = query.keyword
      ? { title: { $regex: query.keyword, $options: 'i' } }
      : {};
    const books = await this.userModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }
  // Get Specific user by Id
  async getUserById(user_id: string): Promise<User> {
    const user = await this.userModel.findOne({userid :user_id }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  // Update User By UserId
  async updateUser(user_id: string, updateData: UpdateUserDto): Promise<User> {
    const updatePayload: any = { ...updateData };

    if (updateData.dateofbirth) {
      updatePayload.dateofbirth = parseStringToDate(updateData.dateofbirth);
    }

    return this.userModel
      .findOneAndUpdate({ userid: user_id }, updatePayload, { new: true })
      .exec();
  }
  // delete User By UserId
  async deleteUser(user_id: string): Promise<User> {
    return this.userModel.findOneAndDelete({userid :user_id}).exec();
  }
}
