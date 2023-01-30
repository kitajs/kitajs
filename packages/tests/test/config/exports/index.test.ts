import { KitaTestBuilder } from '../../builder';

export function get() {}

describe('tests exports functions', () => {
  it('should have AST', async () => {
    const { exported } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportAST: true }
    });

    expect(exported).toHaveProperty('KitaAST');
  });

  it('should have ResolvedConfig', async () => {
    const { exported } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportConfig: true }
    });

    expect(exported).toHaveProperty('ResolvedConfig');
  });

  it('should have KitaControllers', async () => {
    const { exported, KitaAST } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportControllers: true }
    });

    for (const route of KitaAST.routes) {
      expect(exported).toHaveProperty(route.controllerName);
    }
  });

  it('should NOT have Controllers', async () => {
    const { exported, KitaAST } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportAST: true, exportControllers: false }
    });

    for (const route of KitaAST.routes) {
      expect(exported).not.toHaveProperty(route.controllerName);
    }
  });

  it('should NOT have AST and Config', async () => {
    const { exported } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportAST: false, exportConfig: false, exportControllers: false }
    });

    expect(exported).not.toHaveProperty('KitaAST');
    expect(exported).not.toHaveProperty('ResolvedConfig');
  });
});
