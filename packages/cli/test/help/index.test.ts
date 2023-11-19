import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { it } from 'node:test';
import { KITA_BIN } from '../constants';

it('Prints Help Text', () => {
  const cmd = spawnSync(KITA_BIN, ['--help'], {
    cwd: __dirname,
    env: process.env,
    encoding: 'utf-8'
  });

  if (cmd.status !== 0) {
    console.debug(cmd);
  }

  assert.equal(cmd.stderr, '');
  assert.equal(cmd.status, 0);
  assert.ok(
    cmd.stdout.startsWith(
      'Performant and type safe fastify router - Build fast end-to-end APIs with ZERO abstraction cost!\n'
    )
  );
});
