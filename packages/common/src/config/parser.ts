import deepmerge from 'deepmerge';
import fs from 'fs';
import path from 'path';
import { InvalidConfigError, RuntimeNotFoundError } from '../errors';
import { KitaConfig, KitaGeneratorConfig, PartialKitaConfig } from './model';

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = env('cwd') ?? config.cwd ?? root;

  const src = env('src') ?? config.src ?? 'src';

  if (typeof src !== 'string') {
    throw new InvalidConfigError(
      `'src' must be a string: (${JSON.stringify(src)}). Read from ${envOrigin('src')}`,
      config
    );
  }

  let runtimePath = env('runtime_path') ?? config.runtimePath;

  if (!runtimePath) {
    try {
      runtimePath = path.join(
        // Joined @kitajs/runtime and generated separately because when
        // resolve is called on a package name (instead of folder if it was @kitajs/runtime/generated)
        // it will look only for the package.json and resolve from there.
        path.dirname(
          // Allows global installations to work
          require.resolve('@kitajs/runtime', { paths: [cwd] })
        ),
        'generated'
      );
    } catch (error) {
      if ((error as Error).message.startsWith("Cannot find module '@kitajs/runtime'")) {
        throw new RuntimeNotFoundError();
      }

      throw error;
    }
  }

  if (typeof runtimePath !== 'string') {
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

  const watchIgnore = env('watch_ignore') ??
    config.watchIgnore ?? [path.join(cwd, 'node_modules'), path.join(cwd, 'dist'), runtimePath];

  if (!Array.isArray(watchIgnore)) {
    throw new InvalidConfigError(
      `'watch.ignore' must be an array: (${JSON.stringify(watchIgnore)}). Read from ${envOrigin('watch_ignore')}`,
      config
    );
  }

  return {
    cwd,
    tsconfig,
    src: path.resolve(cwd, src),
    declaration: declaration,
    runtimePath: runtimePath,
    watchIgnore: watchIgnore,
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
