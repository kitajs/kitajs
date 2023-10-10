import { AstCollector, KitaConfig, parseConfig } from '@kitajs/common';
import assert from 'assert';
import path from 'path';
import { KitaParser } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}): Promise<AstCollector> {
  const kita = KitaParser.create(
    parseConfig({
      tsconfig,
      cwd,
      providerFolder: 'providers',
      routeFolder: 'routes',
      runtimePath: path.resolve(cwd, 'runtime'),
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
