/// <reference types="@kitajs/runtime" />

import { parseConfig, readCompilerOptions, type PartialKitaConfig } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import fastify, { type FastifyHttpOptions } from 'fastify';
import assert from 'node:assert';
import path from 'node:path';
import { KitaFormatter } from '../src';

const tsconfig = require.resolve('../tsconfig.json');

export async function generateRuntime<R>(cwd: string, partialCfg: PartialKitaConfig = {}): Promise<R> {
  const config = parseConfig({
    cwd,
    src: cwd,
    tsconfig,
    output: path.resolve(cwd, 'runtime.kita.ts'),
    ...partialCfg
  });

  const compilerOptions = readCompilerOptions(tsconfig);

  const kita = KitaParser.create(config, compilerOptions, compilerOptions.rootNames);

  // Should not emit any errors
  for (const error of kita.parse()) {
    console.error(error);
    assert.fail(error);
  }

  const formatter = new KitaFormatter(config, compilerOptions);
  await formatter.generate(kita);

  return import(config.output!);
}

export function createApp<R>(runtime: R, opts?: FastifyHttpOptions<any, any>) {
  const app = fastify(opts);
  app.register((runtime as { Kita: () => void }).Kita);
  return app;
}
