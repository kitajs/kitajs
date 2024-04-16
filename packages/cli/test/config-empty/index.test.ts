import assert from 'node:assert';
import { it } from 'node:test';
import { forkAsync } from '../constants';

it('Prints default config', async () => {
  const cmd = await forkAsync(['config'], {
    cwd: __dirname,
    stdio: 'pipe',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: __dirname
    }
  });

  const cfg = JSON.parse(cmd.stdout);
  assert.equal(typeof cfg, 'object');

  // No need to test all properties
  assert.equal(cfg.cwd, __dirname);
  assert.equal(cfg.runtimePath, __dirname);
});
