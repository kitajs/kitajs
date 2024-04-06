/// <reference types="@kitajs/runtime" />

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { type PartialKitaConfig, parseConfig, readCompilerOptions } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import fastify, { type FastifyHttpOptions } from 'fastify';
import { KitaFormatter } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function generateRuntime<R extends { ready: Promise<void> }>(
  cwd: string,
  partialCfg: PartialKitaConfig = {}
): Promise<R> {
  const config = parseConfig({
    cwd,
    tsconfig,
    src: cwd,
    runtimePath: path.resolve(cwd, 'runtime'),
    ...partialCfg
  });

  const compilerOptions = readCompilerOptions(tsconfig);

  // Create runtime directory if not exists
  await fs.mkdir(config.runtimePath!, { recursive: true });

  const formatter = new KitaFormatter(config);
  const kita = KitaParser.create(config, compilerOptions, compilerOptions.rootNames, formatter);

  // Should not emit any errors
  for await (const error of kita.parse()) {
    console.error(error);
    assert.fail(error);
  }

  await formatter.flush();

  globalThis.KITA_PROJECT_ROOT = config.src;
  const rt = require(config.runtimePath!) as R;
  await rt.ready;
  return rt;
}

export function createApp<R>(runtime: R, opts?: FastifyHttpOptions<any, any>) {
  const app = fastify(opts);
  app.register((runtime as { Kita: () => void }).Kita);
  return app;
}
