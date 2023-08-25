import type { Query } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

export function get(
  name: Query, // defaults to string
  age: Query<number>, // custom type
  customNamed: Query<boolean, 'custom-naming'>, // Custom type and name
  literal: Query<'a'>
) {
  return {
    name,
    age,
    customNamed,
    literal
  };
}

describe('Query', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it.concurrent('works', async () => {
    const response = await test.inject(get, {
      query: {
        name: 'Arthur',
        age: '12',
        'custom-naming': 'true',
        literal: 'a'
      }
    });

    expect(response.statusCode).toBe(200);

    const { age, customNamed, name, literal } = response.json();

    expect(name).toBe('Arthur');

    expect(typeof age).toBe('number');
    expect(age).toBe(12);

    expect(typeof customNamed).toBe('boolean');
    expect(customNamed).toBe(true);

    expect(typeof literal).toBe('string');
    expect(literal).toBe('a');
  });
});
