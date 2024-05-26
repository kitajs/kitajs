import assert from 'node:assert';
import path from 'node:path';
import { it } from 'node:test';
import { forkAsync } from '../constants';

it('Prints overridden config', async () => {
  const cmd = await forkAsync(['config', '-r'], {
    cwd: __dirname,
    stdio: 'pipe',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: __dirname
    }
  });

  assert.equal(cmd.stderr, '');

  const cfg = JSON.parse(cmd.stdout);
  assert.equal(typeof cfg, 'object');

  // This was overridden in the config file
  assert.equal(cfg.src, path.resolve(cfg.cwd, 'not-src'));
});
