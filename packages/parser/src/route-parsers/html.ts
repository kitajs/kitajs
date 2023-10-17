import {
  InvalidHtmlRoute,
  KitaConfig,
  ParameterParser,
  Route,
  RouteParser,
  kReplyParam,
  kRequestParam
} from '@kitajs/common';
import path from 'path';
import { StringType, ts } from 'ts-json-schema-generator';
import { SchemaBuilder } from '../schema/builder';
import { getReturnType, isExportedFunction } from '../util/nodes';
import { cwdRelative } from '../util/paths';
import { findUrlAndControllerName } from '../util/string';
import { buildAccessProperty } from '../util/syntax';
import { traverseParameters } from '../util/traverser';

export class HtmlRouteParser implements RouteParser {
  constructor(
    private config: KitaConfig,
    private paramParser: ParameterParser,
    private checker: ts.TypeChecker,
    private builder: SchemaBuilder
  ) {}

  supports(node: ts.Node): boolean {
    if (!isExportedFunction(node)) {
      return false;
    }

    const sourceFile = node.getSourceFile();

    if (!node.name || !sourceFile) {
      return false;
    }

    // no .jsx is allowed
    if (!sourceFile.fileName.endsWith('.tsx')) {
      return false;
    }

    if (!node.name.text.trim().match(/^get|post|put|delete$/i)) {
      return false;
    }

    return true;
  }

  async parse(node: ts.FunctionDeclaration): Promise<Route> {
    const source = node.getSourceFile();

    const { url, controller } = findUrlAndControllerName(source.fileName, this.config);
    const method = node.name!.getText();

    const route: Route = {
      kind: 'html',
      url,
      controllerMethod: method,
      method: method.toUpperCase() as Uppercase<string>,
      controllerName: controller,
      controllerPath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters: [],
      schema: {
        operationId: method.toLowerCase() + controller.replace(/controller$/i, 'View'),
        hide: true,
        response: { [200 as number]: { type: 'string' } }
      }
    };

    const returnType = this.builder.createTypeSchema(getReturnType(node, this.checker));
    const primitive = this.builder.toPrimitive(returnType, true);

    // Non string return type
    if (!primitive || !(primitive instanceof StringType)) {
      throw new InvalidHtmlRoute(node.type || node, primitive);
    }

    // Adds all parameters in their respective position
    for await (const { param, index } of traverseParameters(node, this.paramParser, route)) {
      route.parameters[index] = param;
    }

    const routeParameters = route.parameters.map((r) => r.value).join(', ');
    const handler = buildAccessProperty(route.controllerName, route.controllerMethod);

    if (
      // If the SuspenseId parameter was used, we need to render as a stream.
      //@ts-expect-error - internal property
      route.parameters.some((p) => p.__type === 'SuspenseId')
    ) {
      const boundCall = `${handler}.bind(undefined${routeParameters ? `, ${routeParameters}` : ''})`;

      route.imports ??= [];
      route.imports.push({ name: '{ renderToStream }', path: '@kitajs/html/suspense' });
      route.customReturn = `return ${kReplyParam}.type('text/html; charset=utf-8').send(renderToStream(${boundCall}, ${kRequestParam}.id));`;
    } else {
      const handlerCall = `${handler}.call(undefined${routeParameters ? `, ${routeParameters}` : ''})`;

      route.customReturn = `${kReplyParam}.type('text/html; charset=utf-8'); return ${handlerCall}`;
    }

    return route;
  }
}
