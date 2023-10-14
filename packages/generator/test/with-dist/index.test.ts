import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import { readCompilerOptions } from '@kitajs/common';
import { walk } from '@kitajs/parser';
import path from 'node:path';
import ts from 'typescript';
import type Runtime from './runtime';

const tsconfig = require.resolve('./tsconfig.json');
const compilerOptions = readCompilerOptions(tsconfig);

describe('Dist usage', async () => {
  const program = ts.createIncrementalProgram({
    options: compilerOptions,
    rootNames: walk(path.join(__dirname, 'src'))
  });

  program.emit();

  const rt = await generateRuntime<typeof Runtime>(
    __dirname,
    {
      cwd: __dirname,
      dist: true,
      routeFolder: 'src/routes',
      providerFolder: 'src/providers',
      tsconfig: tsconfig
    },
    compilerOptions
  );

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
