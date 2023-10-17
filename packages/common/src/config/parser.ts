import fs from 'fs';
import path from 'path';
import { InvalidConfigError } from '../errors';
import { KitaConfig, PartialKitaConfig } from './model';

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

  const dist = env('dist') ?? config.dist ?? true;

  if (typeof dist !== 'boolean') {
    throw new InvalidConfigError(
      `'dist' must be a boolean: (${JSON.stringify(dist)}). Read from ${envOrigin('dist')}`,
      config
    );
  }

  const src = env('src') ?? config.src ?? 'src';

  if (src !== undefined && typeof src !== 'string') {
    throw new InvalidConfigError(
      `'src' must be a string or undefined: (${JSON.stringify(src)}). Read from ${envOrigin('src')}`,
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

  const responses = env('responses') ?? config.responses ?? {};

  if (typeof responses !== 'object') {
    throw new InvalidConfigError(
      `'responses' must be an object: (${JSON.stringify(responses)}). Read from ${envOrigin('responses')}`,
      config
    );
  }

  const generatorConfig = env('generator_config') ??
    config.generatorConfig ?? {
      encodeRefs: true,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended',
      parsers: [],
      formatters: []
    };

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
    dist: dist === true,
    src: src,
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
