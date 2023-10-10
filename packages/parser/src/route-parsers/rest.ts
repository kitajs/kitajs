import { KitaConfig, ParameterParser, ReturnTypeError, Route, RouteParser } from '@kitajs/common';
import path from 'path';
import ts from 'typescript';
import { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { parseJsDocTags } from '../util/jsdoc';
import { getReturnType, isExportedFunction } from '../util/nodes';
import { findUrlAndControllerName } from '../util/string';
import { traverseParameters } from '../util/traverser';

export class RestRouteParser implements RouteParser {
  constructor(
    private config: KitaConfig,
    private schema: SchemaBuilder,
    private paramParser: ParameterParser,
    private typeChecker: ts.TypeChecker
  ) {}

  supports(node: ts.Node): boolean {
    if (!isExportedFunction(node)) {
      return false;
    }

    if (!node.name || !node.getSourceFile()) {
      return false;
    }

    // Allows this parameter to not be defined as this is the last
    // resolver and should try to catch as many routes as possible.
    if (!node.name.text.trim().match(/^get|post|put|delete|all$/i)) {
      return false;
    }

    // TODO: Check if the present this parameter is a Route<> type.
    return true;
  }

  async parse(node: ts.FunctionDeclaration): Promise<Route> {
    const source = node.getSourceFile();

    const { url, controller } = findUrlAndControllerName(source.fileName, this.config);
    const method = node.name!.getText();

    const route: Route = {
      kind: 'rest',
      url,
      controllerMethod: method,
      method: method.toUpperCase() as Uppercase<string>,
      controllerName: controller,
      controllerPath: './' + path.posix.relative(this.config.cwd, source.fileName),
      parameters: [],
      schema: {
        operationId: method.toLowerCase() + controller.replace(/controller$/i, ''),

        // Applies default responses
        response: this.config.responses
      }
    };

    // Adds response type.
    try {
      mergeSchema(route, {
        response: {
          ['2xx' as string]: this.schema.consumeNodeSchema(
            getReturnType(node, this.typeChecker),
            `${route.schema.operationId}Response`
          )
        }
      });
    } catch (error) {
      throw new ReturnTypeError(node, error);
    }

    // Parses all jsdoc functions
    parseJsDocTags(node, route);

    // Adds all parameters in their respective position
    for await (const { param, index } of traverseParameters(node, this.paramParser, route)) {
      route.parameters[index] = param;
    }

    return route;
  }
}
