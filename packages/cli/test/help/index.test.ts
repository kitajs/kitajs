import assert from 'node:assert';
import { it } from 'node:test';
import { forkAsync } from '../constants';

it('Prints Help Text', async () => {
  const cmd = await forkAsync(['--help'], {
    cwd: __dirname,
    env: process.env,
    stdio: 'pipe'
  });

  assert.equal(cmd.stderr, '');

  assert.ok(
    cmd.stdout.startsWith(
      'Performant and type safe fastify router - Build fast end-to-end APIs with ZERO abstraction cost!\n'
    )
  );
});
