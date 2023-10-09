import fs from 'fs';
import path from 'path';
import { InvalidConfigError } from '../errors';
import { KitaConfig, PartialKitaConfig } from './model';

function noop() {}

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = config.cwd ?? root;

  const source = config.source ? path.relative(cwd, config.source) : 'src';

  if (!fs.existsSync(source)) {
    throw new InvalidConfigError(`Source directory ${source} does not exist.`, config);
  }

  const tsconfig = config.tsconfig ?? 'tsconfig.json';

  if (!fs.existsSync(tsconfig)) {
    throw new InvalidConfigError(`Tsconfig file ${tsconfig} does not exist.`, config);
  }

  const providerFolder = path.join(cwd, source, config.providerFolder ?? 'providers');
  const routeFolder = path.join(cwd, source, config.routeFolder ?? 'routes');

  return {
    cwd,
    source,
    tsconfig,
    providerFolder,
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
