import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AddUserDto } from './dto/addUser.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -- Get All users -----
  describe('getAllUsers', () => {
    it('should return an array of users with filters', async () => {
      const queryParams = {
        limit: '10',
        page: '1',
        keyword: 'test',
        minage: '20',
        maxage: '30',
      };

      const expectedResult = [
        { username: 'testuser', firstname: 'First', lastname: 'Last' },
      ];

      jest.spyOn(model, 'find').mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(expectedResult),
        exec: jest.fn().mockResolvedValue(expectedResult),
      } as any);

      const result = await service.getAllUsers(queryParams);
      expect(result).toEqual(expectedResult);
    });
  });
});
