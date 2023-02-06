import { KitaTestBuilder } from '../../builder';

export function get() {}

describe('tests exports functions', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    routes: { exportAST: true, exportControllers: false }
  });

  it('should NOT have Controllers', async () => {
    const { exported, KitaAST } = await test;

    for (const route of KitaAST.routes) {
      expect(exported).not.toHaveProperty(route.controllerName);
    }
  });
});
