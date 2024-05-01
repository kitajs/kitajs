import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type * as Runtime from './runtime.kita';

describe('Method and Url', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects postNotIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.postNotIndex);
    assert.ok(rt.postNotIndexMethod);
    assert.ok(rt.postNotIndexUrl);
  });

  test('url is correct', () => {
    assert.equal(rt.postNotIndexUrl, '/not-index');
  });

  test('method is correct', () => {
    assert.equal(rt.postNotIndexMethod, 'POST');
  });
});
