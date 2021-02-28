import request from 'supertest';
import { getConnection } from 'typeorm';

import { app } from '../app';
import createConnection from '../database';

describe('Survey', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    connection.close();
  });

  it('should be able to create a new survey', async () => {
    const response = await request(app)
      .post('/surveys')
      .send({
        title: 'Queremos ouvir a sua opinião',
        description: 'De 0 a 10, quanto você recomendaria a Rocketseat?',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to get a list of surveys', async () => {
    await request(app)
      .post('/surveys')
      .send({
        title: 'Queremos ouvir a sua opinião',
        description: 'De 0 a 10, quanto você recomendaria a Rocketseat?',
      });

    const response = await request(app)
      .get('/surveys');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
