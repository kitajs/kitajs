import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { it } from 'node:test';
import { KITA_BIN } from '../constants';

it('Builds code', () => {
  const cmd = spawnSync(KITA_BIN, ['build'], {
    cwd: __dirname,
    stdio: 'pipe',
    encoding: 'utf-8',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: path.join(__dirname, 'runtime')
    }
  });

  if (cmd.status !== 0) {
    console.debug(cmd);
  }

  assert.equal(cmd.status, 0);
  assert.equal(cmd.stderr, '');
  assert.ok(cmd.stdout.startsWith('Warming up'));
  assert.ok(existsSync(path.join(__dirname, 'runtime', 'routes', 'customOperationId.js')));
});
