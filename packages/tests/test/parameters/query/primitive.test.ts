import type { Query } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

enum MyEnum {
  A = 'a',
  B = 'B'
}

export function get(
  a: Query<Date>,
  b: Query<URL>,
  c: Query<RegExp>,
  aArr: Query<Date[]>,
  bArr: Query<URL[]>,
  cArr: Query<RegExp[]>,
  enumArr: Query<MyEnum[]>,
  unionArr: Query<('c' | 'D')[]>
) {
  return {
    a,
    b,
    c,
    aArr,
    bArr,
    cArr,
    enumArr,
    unionArr
  };
}

describe('Query', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('works', async () => {
    const response = await test.inject(get, {
      url:
        '/parameters/query/primitive?' +
        'a=2023-01-26T14:23:20.631Z' +
        '&b=https://example.com' +
        '&c=%2F%5Ba-z%5D%2F' +
        '&aArr=2023-01-26T14:23:20.631Z' +
        '&aArr=2023-01-26T14:23:20.631Z' +
        '&bArr=https://example.com' +
        '&bArr=https://example.com' +
        '&cArr=/[a-z]/' +
        '&cArr=/[a-z]/' +
        '&enumArr=a' +
        '&enumArr=B' +
        '&unionArr=c' +
        '&unionArr=D',
      payload: { a: new Date() }
    });

    expect(response.statusCode).toBe(200);

    const { a, b, c, aArr, bArr, cArr, unionArr, enumArr } =
      response.json<ReturnType<typeof get>>();

    expect(a).toBe('2023-01-26T14:23:20.631Z');
    expect(b).toBe('https://example.com');
    expect(c).toBe('/[a-z]/');
    expect(aArr).toEqual(['2023-01-26T14:23:20.631Z', '2023-01-26T14:23:20.631Z']);
    expect(bArr).toEqual(['https://example.com', 'https://example.com']);
    expect(cArr).toEqual(['/[a-z]/', '/[a-z]/']);
    expect(cArr).toEqual(['/[a-z]/', '/[a-z]/']);
    expect(enumArr).toEqual(['a', 'B']);
    expect(unionArr).toEqual(['c', 'D']);
  });
});
