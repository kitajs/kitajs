import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { it } from 'node:test';

const bin = path.resolve(__dirname, '../../bin/dev');

it('Builds code', async () => {
  const cmd = await spawnSync(bin, ['build'], {
    cwd: __dirname,
    stdio: 'pipe',
    encoding: 'utf-8',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: path.join(__dirname, 'runtime')
    }
  });

  assert.equal(cmd.status, 0);
  assert.equal(cmd.stderr, '');
  assert.notEqual(cmd.stdout, '');
  assert.ok(cmd.stdout.startsWith('Warming up'));
  assert.ok(existsSync(path.join(__dirname, 'runtime', 'routes', 'customOperationId.js')));
});
