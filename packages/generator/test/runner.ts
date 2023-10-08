import { KitaConfig, mergeDefaults, readCompilerOptions } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import assert from 'assert';
import fastify, { FastifyInstance } from 'fastify';
import fs from 'fs/promises';
import path from 'path';
import { KitaFormatter } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function generateRuntime<R>(cwd: string, partialCfg: Partial<KitaConfig> = {}): Promise<R> {
  const compilerOptions = readCompilerOptions(tsconfig);

  const config = mergeDefaults({
    tsconfig,
    cwd,
    providers: { glob: [path.resolve(cwd, 'providers/*.ts')] },
    controllers: { glob: [path.resolve(cwd, 'routes/*.ts'), path.resolve(cwd, 'routes/*.tsx')] },
    runtime: path.resolve(cwd, 'runtime'),
    ...partialCfg
  });

  // Create runtime directory if not exists
  await fs.mkdir(config.runtime!, { recursive: true });

  const kita = KitaParser.create(config, compilerOptions);
  const formatter = new KitaFormatter(config, compilerOptions);

  // Generate routes on the fly
  kita.onRoute = (route) => formatter.generateRoute(route);

  // Should not emit any errors
  for await (const error of kita.parse()) {
    console.error(error);
    assert.fail(error);
  }

  await formatter.generate(kita.getRoutes(), kita.getSchemas());
  await formatter.flush();

  return require(config.runtime!) as R;
}

export function createApp<R>(runtime: R, opts?: Parameters<typeof fastify>[0]) {
  const app = fastify(opts);

  app.register((runtime as any).Kita);

  // @ts-expect-error
  app[Symbol.asyncDispose] = app.close.bind(app);

  // @ts-expect-error https://github.com/fastify/fastify/pull/5082
  return app as FastifyInstance & { [Symbol.asyncDispose](): Promise<void> };
}
