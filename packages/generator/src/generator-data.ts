import { KitaConfig } from '@kita/core';
import type { RouteShorthandOptions } from 'fastify';

export class GeneratorResult {
  readonly imports = {
    controllers: [] as string[],
    params: [] as string[],
    addons: [] as string[]
  };

  readonly routes = [] as Route[];

  constructor(readonly config: KitaConfig) {}

  addImport(type: 'controllers' | 'params' | 'addons', importPath: string) {
    if (this.imports[type].indexOf(importPath) === -1) {
      this.imports[type].push(importPath);
    }
  }
}

export type Route = {
  method: string;
  path: string;
  config: RouteShorthandOptions;

  controllerName: string;

  parameters: Parameter[];
};

export type Parameter = {
  /** Any code that needs to be executed before, to this parameter work. */
  helper?: string;
  value: string;
};
