import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust the path as per your application structure

describe('UserOperationsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // block user
  it('/api/v1/userOperations/block (POST)', async () => {
    const userId = 'user1';
    const blockUserId = 'user2';

    const response = await request(app.getHttpServer())
      .post('/api/v1/userOperations/block')
      .send({ userId, blockUserId })
      .expect(201);

    const expectedResponse = {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  // unblock user
  it('/api/v1/userOperations/unblock (POST)', async () => {
    const userId = 'user1';
    const unblockUserId = 'user2';

    const response = await request(app.getHttpServer())
      .post('/api/v1/userOperations/unblock')
      .send({ userId, unblockUserId })
      .expect(200);

    const expectedResponse = {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    };

    expect(response.body).toEqual(expectedResponse);
  });

  //  get blocked users
  it('/api/v1/userOperations/:userId/blocked (GET)', async () => {
    const userId = 'user1';

    const response = await request(app.getHttpServer())
      .get(`/api/v1/userOperations/${userId}/blocked`)
      .expect(200);
    const expectedResponse = [];

    expect(response.body).toEqual(expectedResponse);
  });

  // get unblocked users
  it('/api/v1/userOperations/:userId/unblocked (GET)', async () => {
    const userId = 'user1';

    const response = await request(app.getHttpServer())
      .get(`/api/v1/userOperations/${userId}/unblocked`)
      .expect(200);

    const expectedResponse = [];

    expect(response.body).toEqual(expectedResponse);
  });
});
