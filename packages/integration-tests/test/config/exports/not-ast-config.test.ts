import { KitaTestBuilder } from '../../builder';

export function get() {}

describe('tests exports functions', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    routes: { exportAST: false, exportConfig: false, exportControllers: false }
  });

  it('should NOT have AST and Config', async () => {
    const { exported } = await test;

    expect(exported).not.toHaveProperty('KitaAST');
    expect(exported).not.toHaveProperty('ResolvedConfig');
  });
});
