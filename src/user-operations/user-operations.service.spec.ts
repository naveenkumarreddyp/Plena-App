import { Test, TestingModule } from '@nestjs/testing';
import { UserOperationsService } from './user-operations.service';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = (userid: string, blockedusers: string[] = []) => ({
  userid,
  blockedusers,
});

const mockUserModel = {
  updateOne: jest.fn(),
  findOne: jest.fn(),
};

describe('UserOperationsService', () => {
  let service: UserOperationsService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOperationsService,
        {
          provide: getModelToken(User.name),
          useValue: {
            updateOne: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserOperationsService>(UserOperationsService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should block user', async () => {
    const userId = 'userId1';
    const blockUserId = 'userId2';

    mockUserModel.findOne.mockResolvedValue(mockUser(userId, [blockUserId]));
    mockUserModel.updateOne.mockResolvedValue({ nModified: 1 });
    const result = await service.blockUser(userId, blockUserId);
    expect(result).toEqual({ nModified: 1 });
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ userid: userId });
    expect(mockUserModel.updateOne).toHaveBeenCalledWith(
      { userid: userId },
      { $addToSet: { blockedusers: blockUserId } },
    );
  });
});
