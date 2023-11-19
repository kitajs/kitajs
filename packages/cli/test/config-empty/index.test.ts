import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { it } from 'node:test';
import { KITA_BIN } from '../constants';

it('Prints default config', () => {
  const cmd = spawnSync(KITA_BIN, ['config'], {
    cwd: __dirname,
    stdio: 'pipe',
    encoding: 'utf-8',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: __dirname
    }
  });

  assert.equal(cmd.status, 0);
  assert.equal(cmd.stderr, '');
  assert.notEqual(cmd.stdout, '');

  const cfg = JSON.parse(cmd.stdout);
  assert.equal(typeof cfg, 'object');

  // No need to test all properties
  assert.equal(cfg.cwd, __dirname);
  assert.equal(cfg.runtimePath, __dirname);
});
