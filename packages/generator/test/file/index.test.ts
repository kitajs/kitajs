import { ajvFilePlugin } from '@fastify/multipart';
import { Kita } from '@kitajs/runtime';
import { fastify } from 'fastify';
import formAutoContent from 'form-auto-content';
import assert from 'node:assert';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

const fileA = path.join(__dirname, 'a.txt');
const fileB = path.join(__dirname, 'b.txt');

describe('File', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects postIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.postIndex);
  });

  test('Sends normal file', async () => {
    await using app = fastify({ ajv: { plugins: [ajvFilePlugin] } });
    await app.register(Kita, { runtime });

    // biome-ignore lint/correctness/noConstantCondition: it is a type test
    if (-1 > 1) {
      app.register(Kita, {
        runtime,
        plugins: {
          fastifyMultipart: {
            throwFileSizeLimit: true
          }
        }
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
