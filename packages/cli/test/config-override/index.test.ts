import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { it } from 'node:test';
import { KITA_BIN } from '../constants';

it('Prints overridden config', () => {
  const cmd = spawnSync(KITA_BIN, ['config'], {
    cwd: __dirname,
    stdio: 'pipe',
    encoding: 'utf-8',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: __dirname
    }
  });

  if (cmd.status !== 0) {
    console.debug(cmd);
  }

  assert.equal(cmd.status, 0);
  assert.equal(cmd.stderr, '');

  const cfg = JSON.parse(cmd.stdout);
  assert.equal(typeof cfg, 'object');

  // This was overridden in the config file
  assert.equal(cfg.src, path.resolve(cfg.cwd, 'not-src'));
});
