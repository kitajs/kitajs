import { parseConfig, readCompilerOptions, type KitaConfig } from '@kitajs/common';
import path from 'node:path';
import { KitaParser, walk } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export function parseRoutes(cwd: string, config: Partial<KitaConfig> = {}) {
  const cfg = parseConfig({
    tsconfig,
    cwd,
    src: cwd,
    runtimePath: path.resolve(cwd, 'runtime'),
    ...config
  });

  const kita = KitaParser.create(cfg, readCompilerOptions(tsconfig), walk(cwd));

  // Should not emit any errors
  for (const error of kita.parse()) {
    throw error;
  }

  return kita;
}

export function parseRoutesWithErrors(cwd: string, config: Partial<KitaConfig> = {}) {
  const cfg = parseConfig({
    tsconfig,
    cwd,
    src: cwd,
    ...config
  });

  const kita = KitaParser.create(cfg, readCompilerOptions(tsconfig), walk(cwd));

  const errors = Array.from(kita.parse());

  return { kita, errors };
}
