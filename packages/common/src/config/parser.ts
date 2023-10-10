import fs from 'fs';
import path from 'path';
import { InvalidConfigError } from '../errors';
import { KitaConfig, PartialKitaConfig } from './model';

function noop() {}

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = config.cwd ?? root;

  const tsconfig = path.posix.resolve(cwd, config.tsconfig ?? 'tsconfig.json');

  if (!fs.existsSync(tsconfig)) {
    throw new InvalidConfigError(`Tsconfig file ${tsconfig} does not exist.`, config);
  }

  const providerFolder = path.posix.resolve(cwd, config.providerFolder ?? 'src/providers');
  const routeFolder = path.posix.resolve(cwd, config.routeFolder ?? 'src/routes');

  return {
    cwd,
    tsconfig,
    providerFolder,
    dist: config.dist ?? true,
    runtimePath: config.runtimePath,
    routeFolder,
    responses: config.responses ?? {},
    generatorConfig: config.generatorConfig ?? {
      encodeRefs: true,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended',
      parsers: [],
      formatters: []
    },
    parameterParserAugmentor: config.parameterParserAugmentor || noop,
    providerParserAugmentor: config.providerParserAugmentor || noop,
    routeParserAugmentor: config.routeParserAugmentor || noop
  };
}
