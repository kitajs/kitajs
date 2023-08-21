import { kReplyParam, kRequestParam } from '../constants';
import type { RouteFormatter } from '../formatters';
import type { BaseRoute } from '../models';
import { RestRoute } from '../routes/rest';
import { format, If, join } from '../util/generation';
import { joinParameters } from '../util/syntax';

export class RestRouteFormatter implements RouteFormatter {
  supports(route: BaseRoute): boolean | Promise<boolean> {
    return route instanceof RestRoute;
  }

  format(route: RestRoute): string | Promise<string> {
    return format(/* ts */ `
    /**
     * The operationId for the ${route.schema.operationId} route.
     */
    export const ${route.schema.operationId} = ${route.controllerName}.${route.controllerMethod}.bind(null);

    /**
     * The handler for the ${route.schema.operationId} route.
     * @param ${kRequestParam} The request.
     * @param ${kReplyParam} The reply.
     * @returns The result of the handler.
     */
     export function ${
       route.schema.operationId
     }Handler(${kRequestParam}: FastifyRequest, ${kReplyParam}: FastifyReply) {
      ${joinParameters(route.parameters)}

       return ${route.controllerName}.${route.controllerMethod}(${route.parameters.map((p) => p.value).join(',')})
     }

     /**
      * The configuration for the ${route.schema.operationId} route.
      */
     export const ${route.schema.operationId}Options: RouteOptions = {
       url: ${route.url},
       method: ${route.method},
       handler: ${route.schema.operationId}Handler,
       schema: ${If(
         route.parameters.some((p) => p.providerName && p.schemaTransformer),
         /* ts */ `
            await Promise.resolve(${JSON.stringify(route.schema)})
            ${join(
              route.parameters,
              (p) => /* ts */ `
                .then(schema => ${p.providerName}.mapSchema(schema))
              `,
              (p) => !!p.schemaTransformer
            )}
        `,
         JSON.stringify(route.schema)
       )}
         ,
      ${JSON.stringify(route.options)}
     }
`);
  }
}
