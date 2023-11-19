import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { it } from 'node:test';
import { KITA_BIN } from '../constants';

it('Prints Help Text', async () => {
  const cmd = await spawnSync(KITA_BIN, ['--help'], {
    cwd: __dirname,
    env: process.env,
    encoding: 'utf-8'
  });

  assert.equal(cmd.stderr, '');
  assert.equal(cmd.status, 0);
  assert.notEqual(cmd.stdout, '');
  assert.ok(
    cmd.stdout.startsWith(
      'Performant and type safe fastify router - Build fast end-to-end APIs with ZERO abstraction cost!\n'
    )
  );
});
