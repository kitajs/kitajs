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
    const { exported } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportControllers: true }
    });

    expect(exported).toHaveProperty('KitaControllers');
  });

  it('should NOT have AST, config and controllers', async () => {
    const { exported } = await KitaTestBuilder.build(__filename, exports, {
      routes: { exportAST: false, exportConfig: false, exportControllers: false }
    });

    expect(exported).not.toHaveProperty('KitaAST');
    expect(exported).not.toHaveProperty('ResolvedConfig');
    expect(exported).not.toHaveProperty('KitaControllers');
  });
});
