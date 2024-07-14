import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/users (POST)', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password',
        firstname: 'Naveen',
        lastname: 'P',
        dateofbirth: '14-07-2024',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(userData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('username', userData.username);
      expect(response.body).toHaveProperty('firstname', userData.firstname);
      expect(response.body).toHaveProperty('lastname', userData.lastname);
      expect(new Date(response.body.dateofbirth)).toEqual(
        new Date(userData.dateofbirth),
      );
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('__v');
      expect(response.body).not.toHaveProperty('_id');
    });
  });

  describe('/api/v1/users (GET)', () => {
    it('should get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe('/api/v1/users/:id (GET)', () => {
    let userId: string;

    beforeAll(async () => {
      const user = await usersService.addUser({
        username: 'testuser2',
        password: 'password',
        firstname: 'Naveen Kumar',
        lastname: 'P',
        dateofbirth: '13-07-2024',
      });
      userId = user.userid;
    });

    it('should get a user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('username', 'testuser2');
      expect(response.body).toHaveProperty('firstname', 'Jane');
      expect(response.body).toHaveProperty('lastname', 'Doe');
      expect(new Date(response.body.dateofbirth)).toEqual(
        new Date('13-07-2024'),
      );
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('__v');
      expect(response.body).not.toHaveProperty('_id');
    });

    it('should return 404 if user not found', async () => {
      const invalidUserId = 'invalidUserId';
      await request(app.getHttpServer())
        .get(`/api/v1/users/${invalidUserId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/api/v1/users/:id (PATCH)', () => {
    let userId: string;

    beforeAll(async () => {
      const user = await usersService.addUser({
        username: 'testuser3',
        password: 'password',
        firstname: 'Naveen',
        lastname: 'P',
        dateofbirth: '14-07-2024',
      });
      userId = user.userid;
    });

    it('should update user information', async () => {
      const updateData = {
        firstname: 'Updated Firstname',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/users/${userId}`)
        .send(updateData)
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('firstname', 'Updated Firstname');
      expect(response.body).toHaveProperty('username', 'testuser3');
      expect(response.body).toHaveProperty('lastname', 'P');
      expect(new Date(response.body.dateofbirth)).toEqual(
        new Date('14-07-2024'),
      );
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('__v');
      expect(response.body).not.toHaveProperty('_id');
    });

    it('should return 400 if trying to update non-allowed fields', async () => {
      const updateData = {
        username: 'newusername', // Assuming username cannot be updated
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/users/${userId}`)
        .send(updateData)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/api/v1/users/:id (DELETE)', () => {
    let userId: string;

    beforeAll(async () => {
      const user = await usersService.addUser({
        username: 'testuser4',
        password: 'password',
        firstname: 'Naveen',
        lastname: 'P',
        dateofbirth: '14-07-2024',
      });
      userId = user.userid;
    });

    it('should delete a user by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 if user not found', async () => {
      const invalidUserId = 'invalidUserId';
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${invalidUserId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
