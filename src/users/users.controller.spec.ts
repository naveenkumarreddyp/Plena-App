import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAllUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const expectedResult = [
        {
          _id: 'someId1',
          username: 'user1',
          firstname: 'First1',
          lastname: 'Last1',
          dateofbirth: new Date('2024-07-13'),
          userid: 'userId1',
        },
        {
          _id: 'someId2',
          username: 'user2',
          firstname: 'First2',
          lastname: 'Last2',
          dateofbirth: new Date('2024-07-14'),
          userid: 'userId2',
        },
      ] as any;

      jest.spyOn(service, 'getAllUsers').mockResolvedValue(expectedResult);

      const result = await controller.getAllUsers({});
      expect(result).toEqual(expectedResult);
    });
  });
});
