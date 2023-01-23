import { KitaTestBuilder } from '../../builder';
import type { RandomNumber } from './random-number';
import type { SumHeaders } from './sum-headers';
import path from 'path';

export function get(
  headerSum: SumHeaders<'string', 'header-a', 'header-b'>,
  randomNumber: RandomNumber
) {
  return {
    headerSum,
    randomNumber
  };
}

export function post(
  headerSum: SumHeaders<'number', 'header-c', 'header-d'>,
  randomNumber: RandomNumber
) {
  return {
    headerSum,
    randomNumber
  };
}

describe('tests custom parameters', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    params: {
      RandomNumber: path.resolve(__dirname, './random-number'),
      SumHeaders: path.resolve(__dirname, './sum-headers')
    }
  });

  it('get should work', async () => {
    const responseGet = await test.inject(get, {
      headers: {
        'header-a': '1',
        'header-b': '2'
      }
    });

    expect(responseGet.statusCode).toBe(200);

    const { headerSum, randomNumber } = responseGet.json<ReturnType<typeof get>>();

    expect(typeof headerSum).toBe('string');
    expect(headerSum).toBe('3');
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(1);
  });

  it('post should work', async () => {
    const responseGet = await test.inject(post, {
      headers: {
        'header-c': '2',
        'header-d': '5'
      }
    });

    expect(responseGet.statusCode).toBe(200);

    const { headerSum, randomNumber } = responseGet.json<ReturnType<typeof get>>();

    expect(typeof headerSum).toBe('number');
    expect(headerSum).toBe(7);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(1);
  });
});
