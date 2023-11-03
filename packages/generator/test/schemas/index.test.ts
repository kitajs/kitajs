import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Schemas', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.getIndex({ name: 'Schema' }), 'Hello Schema!');
  });

  test('schema was generated', async () => {
    await using app = createApp(rt);
    await app.ready();

    assert.deepStrictEqual(app.getSchema('Data'), {
      $id: 'Data',
      additionalProperties: false,
      properties: { name: { default: 'Schema', type: 'string' } },
      required: ['name'],
      type: 'object'
    });
  });

  test('getIndex options were generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello Schema!');
  });
});
