import deepmerge from 'deepmerge';
import fs from 'fs';
import path from 'path';
import { InvalidConfigError } from '../errors';
import { KitaConfig, KitaGeneratorConfig, PartialKitaConfig } from './model';

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = env('cwd') ?? config.cwd ?? root;

  const providerFolder = env('provider_folder') ?? config.providerFolder ?? 'src/providers';

  if (typeof providerFolder !== 'string') {
    throw new InvalidConfigError(
      `'providerFolder' must be a string: (${JSON.stringify(providerFolder)}). Read from ${envOrigin(
        'provider_folder'
      )}`,
      config
    );
  }

  const routeFolder = env('route_folder') ?? config.routeFolder ?? 'src/routes';

  if (typeof routeFolder !== 'string') {
    throw new InvalidConfigError(
      `'routeFolder' must be a string: (${JSON.stringify(routeFolder)}). Read from ${envOrigin('route_folder')}`,
      config
    );
  }

  const runtimePath = env('runtime_path') ?? config.runtimePath;

  if (runtimePath !== undefined && typeof runtimePath !== 'string') {
    throw new InvalidConfigError(
      `'runtimePath' must be a string or undefined: (${JSON.stringify(runtimePath)}). Read from ${envOrigin(
        'runtime_path'
      )}`,
      config
    );
  }

  const declaration = env('declaration') ?? config.declaration ?? true;

  if (typeof declaration !== 'boolean') {
    throw new InvalidConfigError(
      `'declaration' must be a boolean: (${JSON.stringify(declaration)}). Read from ${envOrigin('declaration')}`,
      config
    );
  }

  const responses = env('responses') ?? config.responses ?? {};

  if (typeof responses !== 'object') {
    throw new InvalidConfigError(
      `'responses' must be an object: (${JSON.stringify(responses)}). Read from ${envOrigin('responses')}`,
      config
    );
  }

  const generatorConfig = deepmerge<KitaGeneratorConfig>(env('generator_config') ?? config.generatorConfig, {
    encodeRefs: false,
    sortProps: true,
    strictTuples: true,
    jsDoc: 'extended',
    parsers: [],
    formatters: []
  });

  if (typeof generatorConfig !== 'object') {
    throw new InvalidConfigError(
      `'generatorConfig' must be an object: (${JSON.stringify(generatorConfig)}). Read from ${envOrigin(
        'generator_config'
      )}`,
      config
    );
  }

  const tsconfig = path.resolve(cwd, env('cwd') ?? config.tsconfig ?? 'tsconfig.json');

  if (!fs.existsSync(tsconfig)) {
    throw new InvalidConfigError(
      `Tsconfig file ${JSON.stringify(tsconfig)} does not exist, are you on the correct directory?`,
      config
    );
  }

  return {
    cwd,
    tsconfig,
    providerFolder: path.resolve(cwd, providerFolder),
    routeFolder: path.resolve(cwd, routeFolder),
    declaration: declaration,
    runtimePath: runtimePath,
    responses: responses,
    generatorConfig: generatorConfig,
    parameterParserAugmentor: config.parameterParserAugmentor || noop,
    providerParserAugmentor: config.providerParserAugmentor || noop,
    routeParserAugmentor: config.routeParserAugmentor || noop
  };
}

/** Reads and parses as json a environment variable. Following the format: `KITA_${name.toUpperCase()}` */
function env(name: string) {
  const key = `KITA_${name.toUpperCase()}`;
  return process.env[key] ? JSON.parse(process.env[key]!) : undefined;
}

/** Returns the origin of a environment variable. Following the format: `KITA_${name.toUpperCase()}` */
function envOrigin(name: string) {
  return process.env[`KITA_${name.toUpperCase()}`] ? 'environment' : 'config';
}

/** No operation function */
function noop() {}
