import { readCompilerOptions } from '@kitajs/common';
import { walk } from '@kitajs/parser';
import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import ts from 'typescript';
import { generateRuntime } from '../runner';

const tsconfig = require.resolve('./tsconfig.json');
const compilerOptions = readCompilerOptions(tsconfig);

describe('Dist usage', async () => {
  const program = ts.createProgram({
    options: compilerOptions,
    rootNames: walk(path.join(__dirname, 'src'))
  });

  program.emit();

  const runtime = await generateRuntime<typeof import('./src/runtime.kita')>(__dirname, {
    cwd: __dirname,
    src: path.join(__dirname, 'src'),
    tsconfig: tsconfig
  });

  test('expects getIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getIndex);
  });

  test('methods are bound correctly', () => {
    assert.equal(runtime.getIndex(), 'From dist!');
  });

  test('getIndex options were generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'From dist!');
  });
});
