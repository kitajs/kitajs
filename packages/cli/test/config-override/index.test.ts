import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { it } from 'node:test';

const bin = path.resolve(__dirname, '../../bin/dev');

it('Prints overridden config', async () => {
  const cmd = await spawnSync(bin, ['config'], {
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

  // This was overridden in the config file
  assert.equal(cfg.src, path.resolve(cfg.cwd, 'not-src'));
});
