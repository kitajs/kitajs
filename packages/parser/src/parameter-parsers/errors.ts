import {
  AstCollector,
  InvalidParameterUsageError,
  Parameter,
  ParameterParser,
  Route,
  UnknownHttpError,
  kFastifyParam
} from '@kitajs/common';
import http from 'node:http';
import { ts } from 'ts-json-schema-generator';
import { mergeSchema } from '../schema/helpers';
import { getTypeName, getTypeNodeName } from '../util/nodes';

// A map of @fastify/sensible error names to their codes
const messageStatusMap = {} as Record<string, string>;

for (const key in http.STATUS_CODES) {
  messageStatusMap[normalize(key, http.STATUS_CODES[key]!)] = key;
}

/**
 * Normalize function used by fastify sensible.
 *
 * @link https://github.com/fastify/fastify-sensible/blob/a2f544d665d8d68c7683d94ee34fd08d9ecf3301/lib/httpErrors.js#L11C10-L11C20
 */
function normalize(code: string, msg: string) {
  if (code === '414') return 'uriTooLong';
  if (code === '505') return 'httpVersionNotSupported';
  msg = msg.split(' ').join('').replace(/'/g, '');
  msg = msg[0]!.toLowerCase() + msg.slice(1);
  return msg;
}

export class ErrorsParameterParser implements ParameterParser {
  agnostic = true;

  constructor(private readonly collector: AstCollector) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'HttpErrors';
  }

  parse(param: ts.ParameterDeclaration, route: Route, fn: ts.FunctionDeclaration): Parameter {
    // Adds fastify sensible plugin
    if (!this.collector.getPlugin('fastifySensible')) {
      this.collector.addPlugin('fastifySensible', {
        importUrl: '@fastify/sensible',
        options: { sharedSchemaId: 'HttpError' }
      });
    }

    // To find throw declarations
    const paramValue = getTypeName(param);

    if (!fn.body) {
      throw new InvalidParameterUsageError('This function has no body', fn.name || fn);
    }

    ts.forEachChild(fn.body, function loopSourceNodes(node) {
      if (
        // Checks first if the node is a throw statement
        ts.isThrowStatement(node) &&
        // is a method call, like `throw [errors.notFound()]`
        ts.isCallExpression(node.expression) &&
        // is a property access expression, like `throw [errors.notFound]()`
        ts.isPropertyAccessExpression(node.expression.expression) &&
        // is a property access expression, like `throw [errors].notFound()`
        ts.isIdentifier(node.expression.expression.expression) &&
        // is the same as the parameter name
        node.expression.expression.expression.escapedText === paramValue
      ) {
        // The method name, like `throw errors.[notFound]()`
        const method = node.expression.expression.name.escapedText;
        const status = messageStatusMap[method as string];

        if (!status) {
          throw new UnknownHttpError(node.expression.expression.name);
        }

        // Adds the route schema
        mergeSchema(route, {
          response: {
            [status]: {
              // This type will be registered by `sharedSchemaId` option
              // from @fastify/sensible
              $ref: 'HttpError'
            }
          }
        });

        return;
      }

      ts.forEachChild(node, loopSourceNodes);
    });

    return {
      name: ErrorsParameterParser.name,
      value: `${kFastifyParam}.httpErrors`
    };
  }
}
