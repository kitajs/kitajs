import type { Route } from '@kitajs/runtime';
import { KitaTestBuilder } from '../builder';

/**
 * @security default
 * @security parameterized [param1, param2]
 * @security oneparam [param1 param2]
 * @tag tag1
 * @tag tag2
 * @url /test
 * @summary summary
 * @description description
 * @operationid operationid
 */
export function get() {}

/**
 * @operationid operationid2
 */
export function post(this: Route<'notOperationId'>) {}

describe('this options variations', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('tests get function', async () => {
    const { KitaAST } = await test;

    const route = KitaAST.routes.find((r) => r.schema.operationId === 'operationid');

    expect(route).toBeDefined();

    expect((route!.schema as any).security).toStrictEqual([
      { default: [] },
      { parameterized: ['param1', 'param2'] },
      { oneparam: ['param1 param2'] }
    ]);

    expect((route!.schema as any).tags).toStrictEqual(['tag1', 'tag2']);

    expect(route!.url).toBe('/test');

    expect((route!.schema as any).summary).toBe('summary');

    expect((route!.schema as any).description).toBe('description');
  });
});
