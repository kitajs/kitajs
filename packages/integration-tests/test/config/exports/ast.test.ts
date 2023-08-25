import { KitaTestBuilder } from '../../builder';

export function get() {}

describe('tests exports functions', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    routes: { exportAST: true }
  });

  it('should have AST', async () => {
    const { exported } = await test;

    expect(exported).toHaveProperty('KitaAST');
  });
});
