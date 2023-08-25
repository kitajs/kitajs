import type { Query } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

interface Optional {
  a?: number;
  b: number | undefined;
  c: number | null;
  d: number | undefined | null;
}

export function get(a: Query<Optional>) {
  return a;
}

describe('Query', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it.concurrent('works with all defined', async () => {
    const response = await test.inject(get, {
      query: { a: '1', b: '2', c: '3', d: '4' }
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toStrictEqual({ a: 1, b: 2, c: 3, d: 4 });
  });

  it.concurrent('works with none defined', async () => {
    const response = await test.inject(get, {});

    expect(response.statusCode).toBe(500);

    // null !== not defined
    expect(response.json()).toStrictEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: '"c" is required!'
    });
  });

  it.concurrent('works with required defined', async () => {
    const response = await test.inject(get, {
      // no value for c
      url: '/parameters/query/optional?c'
    });

    expect(response.statusCode).toBe(200);

    expect(response.json()).toStrictEqual({
      c: null
    });
  });
});
