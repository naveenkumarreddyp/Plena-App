import { Test, TestingModule } from '@nestjs/testing';
import { UserOperationsService } from './user-operations.service';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

const mockUser = (userid: string, blockedusers: string[] = []) => ({
  userid,
  blockedusers,
});

const mockUserModel = {
  updateOne: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
};

describe('UserOperationsService', () => {
  let service: UserOperationsService;
  let model:Model<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOperationsService],
    }).compile();

    service = module.get<UserOperationsService>(UserOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
