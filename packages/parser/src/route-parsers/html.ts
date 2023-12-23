import {
  DefaultExportedRoute,
  InvalidHtmlRoute,
  KitaConfig,
  ParameterParser,
  Route,
  RouteParser,
  kControllerName,
  kReplyParam,
  kRequestParam
} from '@kitajs/common';
import path from 'path';
import { StringType, ts } from 'ts-json-schema-generator';
import { SuspenseIdParameterParser } from '../parameter-parsers/suspense-id';
import { SchemaBuilder } from '../schema/builder';
import { parseJsDocTags } from '../util/jsdoc';
import { getReturnType, isExportFunction } from '../util/nodes';
import { cwdRelative } from '../util/paths';
import { parseUrl } from '../util/string';
import { traverseParameters } from '../util/traverser';

export class HtmlRouteParser implements RouteParser {
  constructor(
    private config: KitaConfig,
    private paramParser: ParameterParser,
    private checker: ts.TypeChecker,
    private builder: SchemaBuilder
  ) {}

  supports(node: ts.Node): boolean {
    if (!isExportFunction(node)) {
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

    // all should not be allowed
    if (!node.name.text.trim().match(/^get|post|put|delete$/i)) {
      return false;
    }

    const defaultExport = node.modifiers.find((s) => s.kind === ts.SyntaxKind.DefaultKeyword);

    if (defaultExport) {
      throw new DefaultExportedRoute(defaultExport || node.name || node);
    }

    return true;
  }

  async parse(node: ts.FunctionDeclaration): Promise<Route> {
    const source = node.getSourceFile();

    const { url, routeId } = parseUrl(source.fileName, this.config);
    const method = node.name!.getText();

    const route: Route = {
      kind: 'html',
      url,
      controllerMethod: method,
      method: method.toUpperCase() as Uppercase<string>,
      relativePath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters: [],
      schema: {
        operationId: `${method.toLowerCase() + routeId}View`,
        hide: true,
        response: { [200 as number]: { type: 'string' } }
      }
    };

    // Parses all jsdoc tags
    parseJsDocTags(node, route);

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

    if (
      // If the SuspenseId parameter was used, we need to render as a stream.
      route.parameters.some((p) => p.name === SuspenseIdParameterParser.name)
    ) {
      const boundCall = `${kControllerName}.${route.controllerMethod}.bind(undefined${
        routeParameters ? `, ${routeParameters}` : ''
      })`;

      route.imports ??= [];
      route.imports.push({
        name: '{ renderToStream }',
        path: '@kitajs/html/suspense'
      });
      route.customReturn = `return ${kReplyParam}.type('text/html; charset=utf-8').send(renderToStream(${boundCall}, ${kRequestParam}.id));`;
    } else {
      const handlerCall = `${kControllerName}.${route.controllerMethod}.call(undefined${
        routeParameters ? `, ${routeParameters}` : ''
      })`;

      route.customReturn = `${kReplyParam}.type('text/html; charset=utf-8'); return ${handlerCall}`;
    }

    return route;
  }
}
