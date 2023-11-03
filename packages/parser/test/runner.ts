import { AstCollector, KitaConfig, parseConfig, readCompilerOptions } from '@kitajs/common';
import assert from 'assert';
import path from 'path';
import { KitaParser, walk } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}): Promise<AstCollector> {
  const cfg = parseConfig({
    tsconfig,
    cwd,
    providerFolder: 'providers',
    routeFolder: 'routes',
    runtimePath: path.resolve(cwd, 'runtime'),
    ...config
  });

  const kita = KitaParser.create(cfg, readCompilerOptions(tsconfig), walk(cwd));

  // Should not emit any errors
  for await (const error of kita.parse()) {
    console.error(error);
    assert.fail(error);
  }

  return kita;
}
