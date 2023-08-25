import { KitaTestBuilder } from '../../builder';

export function get() {}

describe('tests exports functions', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    routes: { exportControllers: true }
  });

  it('should have KitaControllers', async () => {
    const { exported, KitaAST } = await test;

    for (const route of KitaAST.routes) {
      expect(exported).toHaveProperty(route.controllerName);
    }
  });
});
