import type { Header } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';
import type { ComplexParam } from './complex';
import type { SchemaParam } from './schema';
import type { SimpleParam } from './simple';

export function get(simple: SimpleParam) {
  return simple;
}

export function post(complex: ComplexParam<true>) {
  return complex;
}

export function put(schema: SchemaParam<false>, header: Header<'x-abc'>) {
  return { schema, header };
}

describe('tests custom parameters', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    params: {
      SimpleParam: require.resolve('./simple'),
      ComplexParam: require.resolve('./complex'),
      SchemaParam: [require.resolve('./schema'), { schemaTransformer: true }]
    }
  });

  it.concurrent('tests simple', async () => {
    const simple = await test.inject(get, {
      method: 'GET',
      url: '/parameters/custom'
    });

    expect(simple.body).toBe('Hello from simple!');
  });

  it.concurrent('tests simple', async () => {
    const complex = await test.inject(post, {
      method: 'POST',
      url: '/parameters/custom'
    });

    expect(complex.body).toBe('yes');
  });

  it.concurrent('tests simple', async () => {
    const schema = await test.inject(put, {
      method: 'PUT',
      url: '/parameters/custom',
      headers: {
        'x-abc': '1'
      }
    });

    expect(schema.json()).toStrictEqual({
      schema: 'no',
      header: '1'
    });
  });
});
