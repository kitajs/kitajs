import { parseConfig, readCompilerOptions, type PartialKitaConfig } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import assert from 'node:assert';
import { KitaFormatter } from '../src';
import {} from '/home/hzk/dev/kitajs/kitajs/node_modules/.pnpm/pirates@4.0.6/node_modules/pirates';

const tsconfig = require.resolve('../tsconfig.json');

export async function generateRuntime<R>(cwd: string, partialCfg: PartialKitaConfig = {}): Promise<R> {
  const src = partialCfg.src ?? cwd;

  const config = parseConfig({
    cwd,
    src,
    tsconfig,
    format: true,
    ...partialCfg
  });

  const compilerOptions = readCompilerOptions(tsconfig);

  const kita = KitaParser.create(config, compilerOptions, compilerOptions.rootNames);

  // Should not emit any errors
  for (const error of kita.parse()) {
    assert.fail(error);
  }

  const formatter = new KitaFormatter(config, compilerOptions);
  await formatter.generate(kita);

  return require(config.output!);
}
