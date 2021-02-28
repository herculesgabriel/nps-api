import request from 'supertest';
import { getConnection } from 'typeorm';

import { app } from '../app';
import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    connection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'User Test', email: 'usertest@email.com' });

    expect(response.status).toBe(201);
  });

  it('should not allow to create a user an existent email', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'User Test', email: 'usertest@email.com' });

    expect(response.status).toBe(400);
  });
});
