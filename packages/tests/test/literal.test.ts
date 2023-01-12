import type { Body, Query } from '@kitajs/runtime';
import { KitaTestBuilder } from './builder';

/** post because of body */
export function post(_1: Body<{ a: true }>, _2: Query<false>, _3: Query<'1' | '2'>) {
  expect(_1).toStrictEqual({ a: true });
  expect(_2).toBe(false);
  expect(_3).toBe('1');
}

describe('Tests literal types', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('should work', async () => {
    const response = await test.inject(post, {
      payload: { a: true },
      query: { _2: 'false', _3: '1' }
    });

    expect(response.statusCode).toBe(200); // no content
  });

  it('should fail because of different literal at _3', async () => {
    const response = await test.inject(post, {
      payload: { a: true },
      query: {
        _2: 'false',
        // 3 is not a valid literal type
        _3: '3'
      }
    });

    expect(response.statusCode).toBe(400);
  });
});
