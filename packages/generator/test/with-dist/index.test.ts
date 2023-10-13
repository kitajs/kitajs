import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import path from 'node:path';
import ts from 'typescript';
import type Runtime from './runtime';

describe('Hello World', async () => {
  const program = ts.createProgram([require.resolve('./src/_ignore.ts'), require.resolve('./src/routes/index.ts')], {
    outDir: path.join('./dist'),
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    baseUrl: __dirname
  });

  program.emit();

  const rt = await generateRuntime<typeof Runtime>(__dirname, {
    cwd: __dirname,
    dist: true,
    routeFolder: 'src/routes',
    providerFolder: 'src/providers',
    tsconfig: require.resolve('./tsconfig.json')
  });

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.getIndex(), 'Hello World!');
    assert.equal(rt.getIndex('Arthur'), 'Hello Arthur!');
  });

  test('getIndex options were generated', async () => {
    const app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');

    await app.close();
  });
});
