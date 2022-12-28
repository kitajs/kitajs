import type { Body, Query } from '@kitajs/runtime';
import { testRoute } from '../setup';

/** post because of body */
export function post(
  _1: Body<(string | number | false)[]>,
  _2: Query<string | undefined>,
  _3: Query<boolean | number | null>
) {
  return 'ok';
}

testRoute({
  fn: post,
  exports,
  __filename,
  inject: {
    payload: ['1', 2, '3', 4, false],
    query: {
      _2: 'test',
      _3: '123'
    }
  },
  onAst(ast) {
    const route = ast.routes[0]!;

    expect(route.method).toBe('POST');

    expect(route.schema).toMatchObject({
      body: {
        items: {
          anyOf: [
            { type: 'string' },
            { type: 'number' },
            { const: false, type: 'boolean' }
          ]
        },
        type: 'array'
      },
      querystring: {
        type: 'object',
        required: ['_2', '_3'],
        properties: {
          _2: { anyOf: [{ type: 'string' }, { not: {} }] },
          _3: { type: ['boolean', 'number', 'null'] }
        }
      }
    });
  }
});
