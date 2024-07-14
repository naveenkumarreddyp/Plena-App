import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AddUserDto } from './dto/addUser.dto';
import { parseStringToDate, sanitizeResponse } from '../utils/common.helper';
import { QueryParams, User } from './schemas/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UpdateUserDto, getAllowedFields } from './dto/updateUser.dto';
import { Types } from 'mongoose';

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
      throw new ConflictException('Username already taken -cache');
    }
    let user = await this.userModel.findOne({ username: userInfo.username });
    if (user) {
      await this.cacheManager.set(userInfo.username, 'taken');
      throw new ConflictException('Username already taken');
    }
    let dateOfBirth = parseStringToDate(userInfo.dateofbirth);
    // console.log('dateOfBirth', dateOfBirth);
    let newUser = new this.userModel({
      username: userInfo.username,
      password: userInfo.password,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      dateofbirth: dateOfBirth,
      userid: new Types.ObjectId().toString(),
    });
    await this.cacheManager.set(userInfo.username, 'taken');
    // console.log(JSON.stringify(newUser));
    let savedUser = await newUser.save();
    // console.log('savedUser', JSON.stringify(savedUser));
    let response = sanitizeResponse(savedUser.toObject({ versionKey: false }));
    // console.log('response', JSON.stringify(response));
    return response;
  }

  // Get All Users

  async getAllUsers(query: QueryParams): Promise<User[]> {
    let resPerPage = Number(query.limit) || 10;
    let currentPage = Number(query.page) || 1;
    let skip = Number(query.skip) || resPerPage * (currentPage - 1);
    // Key Word Filter
    let keyword = query.keyword
      ? { username: { $regex: query.keyword, $options: 'i' } }
      : {};
    // Age Filter
    const ageFilter: any = {};
    if (query.minage || query.maxage) {
      const currentDate = new Date();
      let minDate = new Date('1900-01-01'); // default min date
      let maxDate = new Date(currentDate); // default max date

      if (query.minage) {
        minDate = new Date(currentDate);
        minDate.setFullYear(minDate.getFullYear() - Number(query.minage));
      }

      if (query.maxage) {
        maxDate = new Date(currentDate);
        maxDate.setFullYear(maxDate.getFullYear() - Number(query.maxage) - 1);
        maxDate.setDate(maxDate.getDate() + 1); // adjust to include the end of the max age year
      }

      ageFilter.dateofbirth = {
        ...(query.minage ? { $lte: minDate } : {}),
        ...(query.maxage ? { $gte: maxDate } : {}),
      };
    }

    let filter = { ...keyword, ...ageFilter };
    let books = await this.userModel
      .find(filter)
      .limit(resPerPage)
      .skip(skip)
      .select('-password -__v -_id')
      .lean();
    return books;
  }
  // Get Specific user by Id
  async getUserById(user_id: string): Promise<User> {
    // console.log(user_id);
    let user = await this.userModel
      .findOne({ userid: user_id })
      .select('-password -__v -_id')
      .lean()
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  // Update User By UserId
  async updateUser(user_id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findOne({ userid: user_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatePayload: any = {};
    let allowedFields = getAllowedFields();
    for (const key of Object.keys(updateData)) {
      if (!allowedFields.includes(key)) {
        throw new BadRequestException(
          `Field ${key} is not allowed to be updated.`,
        );
      }
      updatePayload[key] = updateData[key];
    }

    if (updateData.dateofbirth) {
      updatePayload.dateofbirth = parseStringToDate(updateData.dateofbirth);
    }
    // console.log(updatePayload);
    return this.userModel
      .findOneAndUpdate({ userid: user_id }, updatePayload, { new: true })
      .select('-password -__v -_id')
      .lean()
      .exec();
  }
  // delete User By UserId
  async deleteUser(user_id: string): Promise<User> {
    const user = await this.userModel.findOne({ userid: user_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel
      .findOneAndDelete({ userid: user_id })
      .select('-password -__v -_id')
      .lean()
      .exec();
  }
}
