import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

import { readCompilerOptions } from '@kitajs/common';
import { walk } from '@kitajs/parser';
import path from 'node:path';
import ts from 'typescript';

//@ts-ignore - first test may not have been run yet
import type * as Runtime from './runtime.kita';
const tsconfig = require.resolve('./tsconfig.json');
const compilerOptions = readCompilerOptions(tsconfig);

describe('Dist usage', async () => {
  const program = ts.createProgram({
    options: compilerOptions,
    rootNames: walk(path.join(__dirname, 'src'))
  });

  program.emit();

  const rt = await generateRuntime<typeof Runtime>(__dirname, {
    cwd: __dirname,
    src: path.join(__dirname, 'src'),
    tsconfig: tsconfig
  });

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.getIndex(), 'From dist!');
  });

  test('getIndex options were generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'From dist!');
  });
});
