import { ajvFilePlugin } from '@fastify/multipart';
import formAutoContent from 'form-auto-content';
import assert from 'node:assert';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

const fileA = path.join(__dirname, 'a.txt');
const fileB = path.join(__dirname, 'b.txt');

describe('File', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects postIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.postIndex);
    assert.ok(rt.postIndexHandler);
  });

  test('Sends normal file', async () => {
    await using app = createApp(rt, { ajv: { plugins: [ajvFilePlugin] } });

    if (-1 > 1) {
      app.register(rt.Kita, {
        fastifyMultipart: {
          throwFileSizeLimit: true
        },
        //@ts-expect-error - type test
        notPresent: { a: true }
      });
    }

    const res = await app.inject({
      method: 'POST',
      url: '/',
      ...formAutoContent({
        file: createReadStream(fileA),
        named: createReadStream(fileB)
      })
    });

    assert.deepStrictEqual(res.json(), true);
    assert.equal(res.statusCode, 200);
  });
});
