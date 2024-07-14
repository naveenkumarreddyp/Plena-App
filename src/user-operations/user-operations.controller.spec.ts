import { Test, TestingModule } from '@nestjs/testing';
import { UserOperationsController } from './user-operations.controller';
import { UserOperationsService } from './user-operations.service';
import { BlockUserDto } from './dto/blockUser.dto';
import { UnblockUserDto } from './dto/unblockUser.dto';

const mockUserOperationsService = {
  blockUser: jest.fn(),
  unblockUser: jest.fn(),
  // getBlockedUsers: jest.fn(),
  // getUnblockedUsers: jest.fn(),
};

describe('UserOperationsController', () => {
  let controller: UserOperationsController;
  let service: UserOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOperationsController],
      providers: [
        {
          provide: UserOperationsService,
          useValue: mockUserOperationsService,
        },
      ],
    }).compile();

    controller = module.get<UserOperationsController>(UserOperationsController);
    service = module.get<UserOperationsService>(UserOperationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should block user', async () => {
    const blockUserDto: BlockUserDto = {
      userId: 'userId1',
      blockUserId: 'userId2',
    };
    await controller.blockUser(blockUserDto);
    expect(service.blockUser).toHaveBeenCalledWith('userId1', 'userId2');
  });
  it('should unblock a user', async () => {
    const unblockUserDto: UnblockUserDto = {
      userId: 'userId1',
      unblockUserId: 'userId2',
    };
    await controller.unblockUser(unblockUserDto);
    expect(service.unblockUser).toHaveBeenCalledWith('userId1', 'userId2');
  });
});
