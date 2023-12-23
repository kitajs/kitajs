import { AstCollector, KitaConfig, parseConfig, readCompilerOptions } from '@kitajs/common';
import path from 'path';
import { KitaParser, walk } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}): Promise<AstCollector> {
  const cfg = parseConfig({
    tsconfig,
    cwd,
    src: cwd,
    runtimePath: path.resolve(cwd, 'runtime'),
    ...config
  });

  const kita = KitaParser.create(cfg, readCompilerOptions(tsconfig), walk(cwd));

  // Should not emit any errors
  for await (const error of kita.parse()) {
    throw error;
  }

  return kita;
}

export async function parseRoutesWithErrors(cwd: string, config: Partial<KitaConfig> = {}) {
  const cfg = parseConfig({
    tsconfig,
    cwd,
    src: cwd,
    runtimePath: path.resolve(cwd, 'runtime'),
    ...config
  });

  const kita = KitaParser.create(cfg, readCompilerOptions(tsconfig), walk(cwd));

  const errors = [];

  // Should not emit any errors
  for await (const error of kita.parse()) {
    errors.push(error);
  }

  return { kita, errors };
}
