import {
  DefaultExportedRoute,
  KitaError,
  ReturnTypeError,
  RouteWithoutReturnError,
  capital,
  type AstCollector,
  type KitaConfig,
  type ParameterParser,
  type Route,
  type RouteParser
} from '@kitajs/common';
import path from 'node:path';
import { UndefinedType, VoidType, ts } from 'ts-json-schema-generator';
import type { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { HttpMethods } from '../util/http';
import { parseJsDocTags } from '../util/jsdoc';
import { getReturnType, isExportFunction } from '../util/nodes';
import { cwdRelative } from '../util/paths';
import { parseUrl } from '../util/string';
import { DefaultOpenApiInfo, ScalarUiTheme } from '../util/swagger';
import { traverseParameters } from '../util/traverser';

export class RestRouteParser implements RouteParser {
  constructor(
    private config: KitaConfig,
    private schema: SchemaBuilder,
    private paramParser: ParameterParser,
    private typeChecker: ts.TypeChecker,
    private collector: AstCollector
  ) {}

  supports(node: ts.Node): boolean {
    if (!isExportFunction(node)) {
      return false;
    }

    if (!node.name || !node.getSourceFile()) {
      return false;
    }

    // Allows this parameter to not be defined as this is the last
    // resolver and should try to catch as many routes as possible.
    if (!HttpMethods.includes(node.name.text.toUpperCase()) && node.name.text.toUpperCase() !== 'ALL') {
      return false;
    }

    return true;
  }

  async parse(node: ts.FunctionDeclaration): Promise<Route> {
    const defaultExport = node.modifiers!.find((s) => s.kind === ts.SyntaxKind.DefaultKeyword);

    if (defaultExport) {
      throw new DefaultExportedRoute(defaultExport || node.name || node);
    }

    // Adds fastify swagger plugin
    if (!this.collector.getPlugin('fastifySwagger')) {
      this.collector.addPlugin('fastifySwagger', {
        name: 'fastifySwagger',
        importUrl: '@fastify/swagger',
        options: {
          mode: 'dynamic',
          openapi: {
            openapi: '3.1.0',
            info: DefaultOpenApiInfo
          },
          refResolver: {
            _raw: '{ buildLocalReference(json, _, __, i) { return json.$id || json.$title || json.name || `def-${i}` } }'
          }
        }
      });
    }

    // Scalar Ui is on a different package
    if (!this.collector.getPlugin('fastifyScalarUi')) {
      this.collector.addPlugin('fastifyScalarUi', {
        name: 'fastifyScalarUi',
        importUrl: '@scalar/fastify-api-reference',
        options: {
          routePrefix: '/reference',
          configuration: {
            theme: 'none',
            customCss: ScalarUiTheme
          }
        }
      });
    }

    const source = node.getSourceFile();

    const { url, routeId } = parseUrl(source.fileName, this.config);
    const method = node.name!.getText();

    const route: Route = {
      kind: 'rest',
      url,
      controllerMethod: method,
      method: method.toUpperCase() as Uppercase<string>,
      relativePath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters: [],
      schema: {
        operationId: method.toLowerCase() + routeId,

        // Applies default responses
        response: this.config.responses
      }
    };

    // Parses all jsdoc tags
    parseJsDocTags(node, route);

    // Adds response type.
    try {
      const returnType = this.schema.createTypeSchema(getReturnType(node, this.typeChecker));
      const primitiveReturn = this.schema.toPrimitive(returnType, true);

      if (primitiveReturn instanceof VoidType || primitiveReturn instanceof UndefinedType) {
        throw new RouteWithoutReturnError(node.type || node.name || node);
      }

      mergeSchema(route, {
        response: {
          ['2xx' as string]: this.schema.consumeNodeSchema(returnType, capital(`${route.schema.operationId}Response`))
        }
      });
    } catch (error) {
      if (error instanceof KitaError) {
        throw error;
      }

      throw new ReturnTypeError(node.type || node.name || node, error);
    }

    // Adds all parameters in their respective position
    for await (const { param, index } of traverseParameters(node, this.paramParser, route)) {
      route.parameters[index] = param;
    }

    return route;
  }
}
