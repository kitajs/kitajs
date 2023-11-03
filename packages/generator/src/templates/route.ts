import { Parameter, Route, capital, kControllerName, kReplyParam, kRequestParam } from '@kitajs/common';
import stringify from 'json-stable-stringify';
import path from 'path';
import { ts } from 'ts-writer';
import { removeExt, toMaybeRelativeImport } from '../util/path';

export function generateRoute(route: Route, cwd: string) {
  const returnTypeName = capital(`${route.schema.operationId}Response`);

  return ts/*ts*/ `${`routes/${route.schema.operationId}`}
  'use strict';

  const ${kControllerName} = require(${toMaybeRelativeImport(route.relativePath)});

  ${route.imports?.map((r) => `const ${r.name} = require(${toMaybeRelativeImport(r.path)});`)}
  ${route.parameters
    .flatMap((p) => p.imports)
    .map((r) => (r ? `const ${r.name} = require(${toMaybeRelativeImport(r.path)});` : null))}
  
  exports.${route.schema.operationId} = ${kControllerName}.${route.controllerMethod}.bind(null);
  
  exports.${route.schema.operationId}Handler = ${toAsyncStatement(
    route.parameters
  )} function(${kRequestParam}, ${kReplyParam}) {
    ${route.parameters.map(toParamHelper)}
    ${
      route.customReturn ||
      `return exports.${route.schema.operationId}(${ts.join(
        route.parameters.map((p) => p.value),
        ','
      )});`
    }
  }

  exports.${route.schema.operationId}Options = ${toOptions(route)};  

  exports.__esModule = true;

  ${ts.types}

  import type * as ${kControllerName} from '${removeExt(path.join(cwd, route.relativePath))}';
  import type { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';

  /**
   * The controller method for the ${route.schema.operationId} route.
   */
  export declare const ${route.schema.operationId}: typeof ${kControllerName}.${route.controllerMethod};

  /**
   * The return type of the controller method.
   *
   * ${String(route.schema.description) || ''}
   */
  export type ${route.schema.operationId}Response = Awaited<ReturnType<typeof ${route.schema.operationId}>>;

  /**
   * Parses the request and reply parameters and calls the ${route.schema.operationId} controller method.
   */
  export declare ${toAsyncStatement(route.parameters)} function ${route.schema.operationId}Handler(
    ${kRequestParam}: FastifyRequest,
    ${kReplyParam}: FastifyReply
  ): ${toAsyncStatement(route.parameters) ? `Promise<${returnTypeName}>` : returnTypeName};
  `;
}

export function toOptions(r: Route) {
  const handler = `{
    url: '${r.url}',
    method: '${r.method}',
    handler: exports.${r.schema.operationId}Handler,
    schema: ${toReplacedSchema(r)},
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

export function toAsyncStatement(parameters: Parameter[]) {
  if (!parameters.some((p) => p.helper?.includes('await'))) {
    return undefined;
  }

  return 'async ';
}

export function toReplacedSchema(r: Route) {
  let code = stringify(r.schema, { space: 2 });

  for (const param of r.parameters) {
    if (param.schemaTransformer) {
      code = `${param.providerName}.transformSchema(${code}${
        Array.isArray(param.schemaTransformer) ? `, ${param.schemaTransformer.join(', ')}` : ''
      })`;
    }
  }

  return code;
}
