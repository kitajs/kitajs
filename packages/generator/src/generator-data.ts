import type { KitaConfig } from '@kitajs/core';
import type { FastifySchema } from 'fastify';
import type { Schema } from 'ts-json-schema-generator';
import type { SchemaStorage } from './json-generator';

export class GeneratorResult {
  readonly imports = {
    controllers: [] as string[],
    params: [] as string[],
    addons: [`import '@fastify/swagger';`]
  };

  readonly routes = [] as Route[];

  readonly schemas: Schema[] = [];

  constructor(readonly config: KitaConfig) {}

  addImport(type: 'controllers' | 'params' | 'addons', importPath: string) {
    if (this.imports[type].indexOf(importPath) === -1) {
      this.imports[type].push(importPath);
    }
  }

  saveSchema(storage: SchemaStorage) {
    this.schemas.push(...storage.getDefinitions());
  }
}

export type Route = {
  method: string;
  path: string;
  schema: FastifySchema;
  controllerName: string;
  parameters: Parameter[];
  /** the operation name */
  operationId?: string;
  /** A stringified js  containing all options that should be extended */
  options: string;
};

export type Parameter = {
  /** Any code that needs to be executed before, to this parameter work. */
  helper?: string;
  value: string;
};
