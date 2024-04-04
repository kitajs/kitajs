import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Parser', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getNameNum was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getNameNum);
    assert.ok(rt.getNameNumHandler);
  });

  test('methods are bound correctly', () => {
    assert.deepStrictEqual(rt.getNameNum('name', 1), { name: 'name', num: 1 });
  });

  test('getNameNum options were generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({
      method: 'GET',
      url: '/kita-1'
    });

    assert.equal(res.statusCode, 200);
    assert.deepStrictEqual(res.json(), { name: 'kita', num: 1 });
  });

  test('getNameNum returns error ', async () => {
    await using app = createApp(rt);

    const res = await app.inject({
      method: 'GET',
      url: '/kita-kita'
    });

    assert.equal(res.statusCode, 400);
    assert.deepStrictEqual(res.json(), {
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'params/num must be number',
      statusCode: 400
    });
  });

  test('methods post are bound correctly', () => {
    assert.deepStrictEqual(rt.postNameNum('kita', 1), { notName: 'kita', notNum: 1 });
  });

  test('postNameNum options were generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({
      method: 'POST',
      url: '/kita-1'
    });

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.json(), { notName: 'kita', notNum: 1 });
  });

  test('postNameNum options returns error', async () => {
    await using app = createApp(rt);

    const res = await app.inject({
      method: 'POST',
      url: '/kita-kita'
    });

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.json(), {
      code: 'FST_ERR_VALIDATION',
      error: 'Bad Request',
      message: 'params/num must be number',
      statusCode: 400
    });
  });
});
