import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { QueryParams, User } from './schemas/user.schema';
import { QueryParamsDto } from './dto/getAllUsers.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AddUserDto } from './dto/addUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: AddUserDto): Promise<User> {
    return this.usersService.addUser(body);
  }

  @Get()
  async getAllUsers(@Query() query: QueryParamsDto): Promise<User[]> {
    return this.usersService.getAllUsers(query);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(id);
  }
}
