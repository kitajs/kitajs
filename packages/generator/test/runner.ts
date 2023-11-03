import { PartialKitaConfig, parseConfig, readCompilerOptions } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import assert from 'assert';
import fastify, { FastifyHttpOptions } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import { KitaFormatter } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function generateRuntime<R>(
  cwd: string,
  partialCfg: PartialKitaConfig = {},
  compilerOptions = readCompilerOptions(tsconfig)
): Promise<R> {
  const config = parseConfig({
    cwd,
    tsconfig,
    routeFolder: 'routes',
    providerFolder: 'providers',
    runtimePath: path.resolve(cwd, 'runtime'),
    dist: false,
    ...partialCfg
  });

  // Create runtime directory if not exists
  await fs.mkdir(config.runtimePath!, { recursive: true });

  const kita = KitaParser.create(config, compilerOptions);
  const formatter = new KitaFormatter(config);

  // Generate routes on the fly
  kita.onRoute = (route) => formatter.generateRoute(route);

  // Should not emit any errors
  for await (const error of kita.parse()) {
    console.error(error);
    assert.fail(error);
  }

  await formatter.generateRuntime(kita.getRoutes(), kita.getSchemas(), kita.getPlugins());

  globalThis.KITA_PROJECT_ROOT = config.cwd;
  return require(config.runtimePath!) as R;
}

export function createApp<R>(runtime: R, opts?: FastifyHttpOptions<any, any>) {
  const app = fastify(opts);
  app.register((runtime as any).Kita);
  return app;
}
