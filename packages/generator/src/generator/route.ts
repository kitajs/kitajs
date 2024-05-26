import { capital, kReplyParam, kRequestParam, type Parameter, type Route } from '@kitajs/common';
import { tst } from '../util/template';

export const createRoute = (route: Route) => tst/* ts */ `
  ${toAsyncStatement(route.parameters)} function ${route.schema.operationId}Handler(
    ${kRequestParam}: FastifyRequest,
    ${kReplyParam}: FastifyReply
  ) {
    ${route.parameters.filter((p) => p.helper).map(toParamHelper)}

    return ${kReplyParam}.${route.customSend || 'send'}(${route.controllerName}.${route.controllerMethod}(${route.parameters
      .map((p) => p.value)
      .filter((p) => p !== undefined)
      .join(',')}))
  }
`;

export const createRouteType = (route: Route) => tst/* ts */ `
  export type ${capital(`${route.schema.operationId}Response`)} = Awaited<ReturnType<typeof ${route.controllerName}.${route.controllerMethod}>>
`;

const toParamHelper = (param: Parameter) => tst/* ts */ `
  ${param.helper}

  if (${kReplyParam}.sent) {
    return ${kReplyParam}
  }
`;

const toAsyncStatement = (parameters: Parameter[]) => {
  if (parameters.some((p) => p.helper?.includes('await'))) {
    return 'async ';
  }

  return undefined;
};
