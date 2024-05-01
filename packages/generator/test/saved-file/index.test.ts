import { ajvFilePlugin } from '@fastify/multipart';
import formAutoContent from 'form-auto-content';
import assert from 'node:assert';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type * as Runtime from './runtime.kita';
const fileC = path.join(__dirname, 'c.txt');
const fileD = path.join(__dirname, 'd.txt');

describe('Saved File', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects postIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.postIndex);
    assert.ok(rt.postIndexHandler);
  });

  test('Works with SavedFile', async () => {
    await using app = createApp(rt, { ajv: { plugins: [ajvFilePlugin] } });

    // biome-ignore lint/correctness/noConstantCondition: it is a test
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
        file: createReadStream(fileC),
        named: createReadStream(fileD)
      })
    });

    assert.deepStrictEqual(res.json(), true);
    assert.equal(res.statusCode, 200);

    await app.close();
  });
});
