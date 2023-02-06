import { KitaTestBuilder } from '../../builder';

export function get() {}

describe('tests exports functions', () => {
  const test = KitaTestBuilder.build(__filename, exports, {
    routes: { exportConfig: true }
  });
  it('should have ResolvedConfig', async () => {
    const { exported } = await test;

    expect(exported).toHaveProperty('ResolvedConfig');
  });
});
