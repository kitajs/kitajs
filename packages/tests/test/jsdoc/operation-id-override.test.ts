import type { Route } from '@kitajs/runtime';
import { KitaTestBuilder } from '../builder';

/**
 * @operationid not-priority
 */
export function get(this: Route<'priority'>) {}

describe('this options variations', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('tests get function', async () => {
    const { KitaAST } = await test;

    expect(KitaAST.routes).toHaveLength(1);
    expect(KitaAST.routes[0]!.schema.operationId).toBe('priority');
  });
});
