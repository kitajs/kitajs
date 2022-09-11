import type { FastifyInstance } from 'fastify';
import { createApp } from '../../src/app';
import { generateKita } from '../create';

describe('Tests with request and response parameters', () => {
  let app!: FastifyInstance;

  beforeAll(async () => {
    app = createApp(await generateKita());
  });

  it('should return 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/parameters/req-rep'
    });

    expect(response.statusCode).toBe(200);
  });
});
