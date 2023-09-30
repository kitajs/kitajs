import { KitaConfig, KitaEventEmitter, mergeDefaults } from '@kitajs/common';
import assert from 'assert';
import test from 'node:test';
import path from 'path';
import { KitaParser } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}) {
  const emitter = new KitaEventEmitter();

  const kita = new KitaParser(
    tsconfig,
    mergeDefaults({
      providers: { glob: [path.resolve(cwd, 'providers/*.ts')] },
      controllers: { glob: [path.resolve(cwd, 'routes/*.ts')] },
      ...config
    }),
    cwd,
    emitter
  );

  const noop = test.mock.fn();

  emitter.on('kitaError', noop);
  emitter.on('unknownError', noop);

  await kita.parseProviders();
  await kita.parseRoutes();

  assert.strictEqual(noop.mock.calls.length, 0);

  return {
    kita,
    emitter
  };
}
