import deepmerge from 'deepmerge';
import path from 'path';
import { KitaConfig, KitaGeneratorConfig, PartialKitaConfig } from './model';

/** Parses and validates the config. */
export function parseConfig(config: PartialKitaConfig = {}, root = process.cwd()): KitaConfig {
  const cwd = config.cwd ?? root;

  const defaultProviderFolder = config.providerFolder ?? 'src/providers';
  const defaultRouteFolder = config.routeFolder ?? 'src/routes';

  return {
    cwd,
    tsconfig: path.resolve(cwd, config.tsconfig ?? 'tsconfig.json'),
    providerFolder: path.resolve(cwd, defaultProviderFolder),
    routeFolder: path.resolve(cwd, defaultRouteFolder),
    dist: Boolean(config.dist ?? true),
    src: String(config.src ?? 'src'),
    runtimePath: config.runtimePath,
    responses: config.responses ?? {},
    generatorConfig: deepmerge<KitaGeneratorConfig>(config.generatorConfig || {}, {
      encodeRefs: false,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended',
      parsers: [],
      formatters: []
    }),
    parameterParserAugmentor: config.parameterParserAugmentor || function noop() {},
    providerParserAugmentor: config.providerParserAugmentor || function noop() {},
    routeParserAugmentor: config.routeParserAugmentor || function noop() {},
    dev: {
      server: config.dev?.server ?? 'node --inspect=1228 dist/index.js',
      pid: config.dev?.pid ?? 'dist/server.pid',
      watch: config.dev?.watch ?? 'dist/**/*',
      ignore: config.dev?.ignore,
      debounce: config.dev?.debounce ?? 2000,
      warn: config.dev?.warn ?? true,
      bell: config.dev?.bell ?? true,
      clear: config.dev?.clear ?? false,
      hooks: config.dev?.hooks ?? [
        {
          watch: [`${defaultProviderFolder}/**/*`, `${defaultRouteFolder}/**/*`],
          exec: 'npx kita build',
          debounce: 1000,
          init: true
        },
        { exec: 'npx tsc --watch --preserveWatchOutput', debounce: 1000, async: true, init: true }
      ]
    }
  };
}
