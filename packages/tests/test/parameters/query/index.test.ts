import type { Query } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

export function get(
  name: Query, // defaults to string
  age: Query<number>, // custom type
  ageString: Query<'namedAge'>, // custom name
  customNamed: Query<boolean, 'custom-naming'> // Custom type and name
) {
  return {
    name,
    age,
    ageString,
    customNamed
  };
}

describe('Query', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('works', async () => {
    const response = await test.inject(get, {
      query: {
        name: 'Arthur',
        age: '12',
        namedAge: 'twelve',
        'custom-naming': 'true'
      }
    });

    expect(response.statusCode).toBe(200);

    const { age, ageString, customNamed, name } = response.json<ReturnType<typeof get>>();

    expect(name).toBe('Arthur');

    expect(typeof age).toBe('number');
    expect(age).toBe(12);

    expect(ageString).toBe('twelve');

    expect(typeof customNamed).toBe('boolean');
    expect(customNamed).toBe(true);
  });
});
