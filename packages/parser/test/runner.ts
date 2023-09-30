import { KitaConfig, KitaEventEmitter, mergeDefaults } from '@kitajs/common';
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

  await kita.parseProviders();
  await kita.parseRoutes();

  return {
    kita,
    emitter
  };
}
