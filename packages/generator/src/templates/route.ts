import {
  capital,
  kControllerName,
  kReplyParam,
  kRequestParam,
  type Parameter,
  type Provider,
  type Route
} from '@kitajs/common';
import path from 'node:path';
import { ts } from 'ts-writer';
import { escapePath, removeExt, toMaybeRelativeImport } from '../util/path';

export function generateRoute(route: Route, cwd: string, cwdSrcRelativity: string, providers: Provider[]) {
  const returnTypeName = capital(`${route.schema.operationId}Response`);

  return ts`${`routes/${route.schema.operationId}`}
  'use strict';

  const ${kControllerName} = require(${toMaybeRelativeImport(route.relativePath, cwdSrcRelativity)});

  ${route.parameters
    .flatMap((p) => p.imports)
    .filter((imp): imp is { name: string; path: string } => !!imp)
    // Remove duplicates
    .filter((imp, index, arr) => arr.findIndex((i) => i.name === imp.name) === index)
    .map((r) => `const ${r.name} = require(${toMaybeRelativeImport(r.path, cwdSrcRelativity)});`)}
  
  exports.${route.schema.operationId} = ${kControllerName}.${route.controllerMethod}.bind(null);
  
  exports.${route.schema.operationId}Handler = ${toAsyncStatement(route.parameters)}function ${
    route.schema.operationId
  }Handler(${kRequestParam}, ${kReplyParam}) {
    ${route.parameters.map(toParamHelper)}
  
    return ${kReplyParam}.${route.customSend || 'send'}(exports.${route.schema.operationId}(${ts.join(
      route.parameters.map((p) => p.value),
      ','
    )}));
  }

  ${route.method === 'ALL' ? `const { supportedMethods } = require('fastify/lib/httpMethods');` : ''}

  exports.${route.schema.operationId}Options = ${toOptions(route, providers)};

  exports.${route.schema.operationId}Url = ${JSON.stringify(route.url)};

  exports.${route.schema.operationId}Method = ${JSON.stringify(route.method)};

  exports.__esModule = true;

  ${ts.types}

  import type * as ${kControllerName} from '${escapePath(removeExt(path.join(cwd, route.relativePath)))}';
  import type { FastifyRequest, FastifyReply } from 'fastify';

  /**
   * The controller method for the ${route.schema.operationId} route.
   */
  export declare const ${route.schema.operationId}: typeof ${kControllerName}.${route.controllerMethod};

  /**
   * The url for the ${route.schema.operationId} route.
   */
  export declare const ${route.schema.operationId}Url: string;

  /**
   * The method for the ${route.schema.operationId} route.
   */
  export declare const ${route.schema.operationId}Method: string;

  /**
   * The return type of the controller method.
   *
   * ${String(route.schema.description || '')}
   */
  export type ${returnTypeName} = Awaited<ReturnType<typeof ${route.schema.operationId}>>;

  /**
   * Parses the request and reply parameters and calls the ${route.schema.operationId} controller method.
   */
  export declare function ${route.schema.operationId}Handler(
    ${kRequestParam}: FastifyRequest,
    ${kReplyParam}: FastifyReply
  ): ${toAsyncStatement(route.parameters) ? `Promise<${returnTypeName}>` : returnTypeName};
  `;
}

export function toOptions(r: Route, providers: Provider[]) {
  const handler = `{
    url: '${r.url}',
    method: ${r.method === 'ALL' ? 'supportedMethods' : `'${r.method}'`},
    handler: exports.${r.schema.operationId}Handler,
    schema: ${toReplacedSchema(r)},
    ${toLifecycleArray(r.parameters, providers)}
 }`;

  return r.options ? r.options.replace('$1', handler) : handler;
}

export function toParamHelper(param: Parameter) {
  if (!param.helper) {
    return undefined;
  }

  return `${param.helper}
  
  // This helper may have already resolved this request
  if (${kReplyParam}.sent) {
    return reply;
  }`;
}
