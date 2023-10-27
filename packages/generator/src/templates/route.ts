import { Parameter, Route, kReplyParam, kRequestParam } from '@kitajs/common';
import stringify from 'json-stable-stringify';
import { EOL } from 'os';
import { formatImport } from '../util/path';

/** Generates a route file. */
export const route = (r: Route, cwd: string) =>
  /* ts */ `

import type { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';

import * as ${r.controllerName} from '${formatImport(r.controllerPath, cwd)}';

${r.imports?.map((r) => `import ${r.name} from '${formatImport(r.path, cwd)}'`).join(EOL) || ''}

${
  r.parameters
    .flatMap((p) => p.imports)
    .filter(Boolean)
    .map((r) => `import ${r!.name} from '${formatImport(r!.path, cwd)}'`)
    .join(EOL) || ''
}

export const ${r.schema.operationId}: typeof ${r.controllerName}['${r.controllerMethod}'] = ${r.controllerName}.${
    r.controllerMethod
  }.bind(null);

/**
 * Parses the request and reply parameters and calls the ${r.schema.operationId} controller method.
 */
export ${needsAsync(r.parameters)} function ${
    r.schema.operationId
  }Handler(${kRequestParam}: FastifyRequest, ${kReplyParam}: FastifyReply) {
  ${r.parameters.map(paramHelper).filter(Boolean).join(EOL)}

  ${
    r.customReturn ||
    /* ts */ `
    
    return ${r.schema.operationId}(${r.parameters.map((p) => p.value).join(', ')});
    
    `.trim()
  }
}

/**
 * Options for the ${r.schema.operationId} route.
 * 
 * @internal
 */
export const ${r.schema.operationId}Options: RouteOptions = ${options(r)};

`.trim();

/** Renders the options for a route and wraps it in the options wrapper if needed. */
const options = (r: Route) => {
  let handler = /* ts */ `

{
  url: '${r.url}',
  method: '${r.method}',
  handler: ${r.schema.operationId}Handler,
  schema: ${schema(r)},
}

`.trim();

  if (r.options) {
    handler = r.options.replace('$1', handler);
  }

  return handler;
};

/** Renders all parameter helpers */
const paramHelper = (param: Parameter) =>
  param.helper
    ? /* ts */ `

${param.helper}

// This helper may have already resolved this request
if (${kReplyParam}.sent) {
  return reply;
}

`.trim()
    : undefined;

/** Renders `async` if some parameter helper needs it */
const needsAsync = (parameters: Parameter[]) => (parameters.some((p) => p.helper?.includes('await')) ? 'async ' : '');

const schema = (r: Route) => {
  let code = stringify(r.schema, { space: 2 });

  for (const param of r.parameters) {
    if (param.schemaTransformer) {
      code = `${param.providerName}.transformSchema(${code}${
        Array.isArray(param.schemaTransformer) ? `, ${param.schemaTransformer.join(', ')}` : ''
      })`;
    }
  }

  return code;
};
