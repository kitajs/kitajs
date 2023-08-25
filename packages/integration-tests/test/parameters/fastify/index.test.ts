import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { KitaTestBuilder } from '../../builder';

export function get(request: FastifyRequest) {
  return request.method;
}

export function post(reply: FastifyReply) {
  reply.header('test', true);
}

export function put(fastify: FastifyInstance) {
  //@ts-expect-error
  return fastify.test;
}

describe('tests fastify parameters', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it.concurrent('should work with FastifyRequest', async () => {
    const result = await test.inject(get);

    expect(result.body).toBe('GET');
  });

  it.concurrent('should work with FastifyReply', async () => {
    const result = await test.inject(post);

    expect(result.headers['test']).toBe(true);
  });

  it.concurrent('should work with FastifyInstance', async () => {
    const { app } = await test;

    app.decorate('test', 123);

    const result = await test.inject(put);

    expect(result.json()).toBe(123);
  });
});
