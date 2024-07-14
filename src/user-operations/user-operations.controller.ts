import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserOperationsService } from './user-operations.service';
import { BlockUserDto } from 'src/dto/blockUser.dto';
import { UnblockUserDto } from 'src/dto/unblockUser.dto';

@Controller('user-operations')
export class UserOperationsController {
  constructor(private readonly userOperationsService: UserOperationsService) {}

  @Post('block')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async blockUser(@Body() blockUserDto: BlockUserDto) {
    const { userId, blockUserId } = blockUserDto;
    return this.userOperationsService.blockUser(userId, blockUserId);
  }

  @Post('unblock')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async unblockUser(@Body() unblockUserDto: UnblockUserDto) {
    const { userId, unblockUserId } = unblockUserDto;
    return this.userOperationsService.unblockUser(userId, unblockUserId);
  }

  @Get(':userId/blocked')
  async getBlockedUsers(@Param('userId') userId: string) {
    return this.userOperationsService.getBlockedUsers(userId);
  }

  @Get(':userId/unblocked')
  async getUnblockedUsers(@Param('userId') userId: string) {
    return this.userOperationsService.getUnblockedUsers(userId);
  }
}
