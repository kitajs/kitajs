import { AstCollector, KitaConfig, mergeDefaults } from '@kitajs/common';
import assert from 'assert';
import path from 'path';
import { KitaParser } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}): Promise<AstCollector> {
  const kita = KitaParser.create(
    mergeDefaults({
      tsconfig,
      cwd,
      providers: { glob: [path.resolve(cwd, 'providers/*.ts')] },
      controllers: { glob: [path.resolve(cwd, 'routes/*.ts'), path.resolve(cwd, 'routes/*.tsx')] },
      ...config
    })
  );

  // Should not emit any errors
  for await (const error of kita.parse()) {
    console.error(error);
    assert.fail(error);
  }

  return kita;
}
