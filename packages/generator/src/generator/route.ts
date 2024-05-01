import { capital, kReplyParam, kRequestParam, type Parameter, type Route } from '@kitajs/common';
import { tst } from '../util/template';

export const createRoute = (route: Route) => tst/* ts */ `

 
/**
 * The url for the ${route.schema.operationId} route.
 */
export const ${route.schema.operationId}Url = ${JSON.stringify(route.url)};

/**
 * The method for the ${route.schema.operationId} route.
 */
export const ${route.schema.operationId}Method = ${JSON.stringify(route.method)};

/**
 * The return type of the controller method.
 *
 * ${String(route.schema.description || '')}
 */
export type ${capital(`${route.schema.operationId}Response`)} = Awaited<ReturnType<typeof ${route.controllerName}.${route.controllerMethod}>>;

/**
 * Parses the request and reply parameters and calls the ${route.schema.operationId} controller method.
 */
export ${toAsyncStatement(route.parameters)} function ${route.schema.operationId}Handler(
  ${kRequestParam}: any,
  ${kReplyParam}: any
) {
  ${route.parameters.filter((p) => p.helper).map(toParamHelper)}

  return ${kReplyParam}.${route.customSend || 'send'}(${route.controllerName}.${route.controllerMethod}(${route.parameters
    .map((p) => p.value)
    .filter(Boolean)
    .join(',')}));
};

`;

const toParamHelper = (param: Parameter) => tst/* ts */ `

${param.helper}
  
// This helper may have already resolved this request
if (${kReplyParam}.sent) {
  return reply;
}

`;

const toAsyncStatement = (parameters: Parameter[]) => {
  if (!parameters.some((p) => p.helper?.includes('await'))) {
    return undefined;
  }

  return 'async ';
};
