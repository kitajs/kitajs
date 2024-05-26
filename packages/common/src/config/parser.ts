import deepmerge from 'deepmerge';
import { error } from 'node:console';
import fs from 'node:fs';
import path from 'node:path';
import { InvalidConfigError, KitaError } from '../errors';
import type { KitaConfig, KitaGeneratorConfig, PartialKitaConfig } from './model';

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = env('cwd', String) ?? config.cwd ?? root;

  let esm = env('esm', strToBool) ?? config.esm ?? false;

  try {
    const packageJson = require(path.join(cwd, 'package.json'));

    switch (packageJson?.type) {
      case undefined:
      case 'commonjs':
        esm = false;
        break;
      case 'module':
        esm = true;
        break;
      default:
        throw new InvalidConfigError(
          `Invalid package.json type: ${packageJson.type}. Only 'commonjs' or 'module' are supported.`,
          config
        );
    }
  } catch (e) {
    if (e instanceof KitaError) {
      throw error;
    }
  }

  let src = env('src', String) ?? config.src ?? 'src';

  if (typeof src !== 'string') {
    throw new InvalidConfigError(
      `'src' must be a string: (${JSON.stringify(src)}). Read from ${envOrigin('src')}`,
      config
    );
  }

  src = path.resolve(cwd, src);

  const format = env('format', strToBool) ?? config.format ?? !!process.stdout.isTTY;

  if (typeof format !== 'boolean') {
    throw new InvalidConfigError(
      `'format' must be a boolean: (${JSON.stringify(format)}). Read from ${envOrigin('format')}`,
      config
    );
  }

  let output = env('output', String) ?? config.output;

  if (output) {
    output = path.resolve(cwd, output);
  } else {
    output = path.join(src, 'runtime.kita.ts');
  }

  const responses = env('responses', JSON.parse) ?? config.responses ?? {};

  if (typeof responses !== 'object') {
    throw new InvalidConfigError(
      `'responses' must be an object: (${JSON.stringify(responses)}). Read from ${envOrigin('responses')}`,
      config
    );
  }

  const generatorConfig = deepmerge<KitaGeneratorConfig>(
    env('generator_config', JSON.parse) ?? config.generatorConfig,
    {
      encodeRefs: false,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended',
      parsers: [],
      formatters: []
    }
  );

  if (typeof generatorConfig !== 'object') {
    throw new InvalidConfigError(
      `'generatorConfig' must be an object: (${JSON.stringify(generatorConfig)}). Read from ${envOrigin(
        'generator_config'
      )}`,
      config
    );
  }

  const tsconfig = path.resolve(cwd, env('cwd', String) ?? config.tsconfig ?? 'tsconfig.json');

  if (!fs.existsSync(tsconfig)) {
    throw new InvalidConfigError(
      `Tsconfig file ${JSON.stringify(tsconfig)} does not exist, are you on the correct directory?`,
      config
    );
  }

  const watchIgnore = env('watch_ignore', (x) => String(x).split(',')) ??
    config.watchIgnore ?? [path.join(cwd, 'node_modules'), path.join(cwd, 'dist'), output];

  if (!Array.isArray(watchIgnore)) {
    throw new InvalidConfigError(
      `'watch.ignore' must be an array: (${JSON.stringify(watchIgnore)}). Read from ${envOrigin('watch_ignore')}`,
      config
    );
  }

  return {
    cwd,
    src,
    esm,
    tsconfig,
    format,
    output,
    watchIgnore,
    responses,
    generatorConfig,
    parameterParserAugmentor: config.parameterParserAugmentor || noop,
    providerParserAugmentor: config.providerParserAugmentor || noop,
    routeParserAugmentor: config.routeParserAugmentor || noop
  };
}

/** Reads and parses as json a environment variable. Following the format: `KITA_${name.toUpperCase()}` */
function env<T>(name: string, cast: (x: any) => T) {
  const key = `KITA_${name.toUpperCase()}`;

  if (!process.env[key]) {
    return undefined;
  }

  return cast(process.env[key]!);
}

/** Returns the origin of a environment variable. Following the format: `KITA_${name.toUpperCase()}` */
function envOrigin(name: string) {
  return process.env[`KITA_${name.toUpperCase()}`] ? 'environment' : 'config';
}

/** No operation function */
function noop() {}

// I guess this covers enough cases for now.
function strToBool(str: string) {
  switch (str.toLowerCase().trim()) {
    case '':
    case '0':
    case 'false':
    case 'no':
    case 'n':
    case 'off':
      return false;
    case '1':
    case 'true':
    case 'yes':
    case 'y':
    case 'on':
      return true;
    default:
      throw new InvalidConfigError(`Invalid boolean string: ${str}.`);
  }
}
