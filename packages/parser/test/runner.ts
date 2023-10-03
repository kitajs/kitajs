import { KitaConfig, KitaParser, mergeDefaults } from '@kitajs/common';
import assert from 'assert';
import path from 'path';
import { DefaultKitaParser } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}): Promise<KitaParser> {
  const kita = new DefaultKitaParser(
    tsconfig,
    mergeDefaults({
      providers: { glob: [path.resolve(cwd, 'providers/*.ts')] },
      controllers: { glob: [path.resolve(cwd, 'routes/*.ts')] },
      ...config
    }),
    cwd
  );

  // Should not emit any errors
  for await (const error of kita.parse()) {
    assert.fail(error.message);
  }

  return kita;
}
