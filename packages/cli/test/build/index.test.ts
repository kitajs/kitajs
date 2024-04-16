import assert from 'node:assert';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { it } from 'node:test';
import { forkAsync } from '../constants';

it('Builds code', async () => {
  const cmd = await forkAsync(['build'], {
    cwd: __dirname,
    stdio: 'pipe',
    env: {
      ...process.env,
      KITA_RUNTIME_PATH: path.join(__dirname, 'runtime')
    }
  });

  assert.equal(cmd.stderr, '');
  assert.ok(cmd.stdout.startsWith('Searching runtime...'));
  assert.ok(existsSync(path.join(__dirname, 'runtime', 'routes', 'customOperationId.js')));
});
