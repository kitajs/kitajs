import deepmerge from 'deepmerge';
import fs from 'node:fs';
import path from 'node:path';
import { InvalidConfigError, UnreachableRuntime } from '../errors';
import type { KitaConfig, KitaGeneratorConfig, PartialKitaConfig } from './model';

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = env('cwd', String) ?? config.cwd ?? root;

  const src = env('src', String) ?? config.src ?? 'src';

  const format = env('format', Boolean) ?? config.format ?? process.stdout.isTTY;

  const output = path.resolve(cwd, env('output', String) ?? config.output ?? `src${path.sep}runtime.kita.ts`);

  try {
    fs.mkdirSync(path.dirname(output), { recursive: true });
  } catch (error: any) {
    throw new UnreachableRuntime(output, error);
  }

  const declaration = env('declaration', Boolean) ?? config.declaration ?? true;

  if (typeof declaration !== 'boolean') {
    throw new InvalidConfigError(
      `'declaration' must be a boolean: (${JSON.stringify(declaration)}). Read from ${envOrigin('declaration')}`,
      config
    );
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
    tsconfig,
    format,
    declaration,
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
