import {
  DefaultExportedRoute,
  InvalidHtmlRoute,
  type AstCollector,
  type KitaConfig,
  type ParameterParser,
  type Route,
  type RouteParser
} from '@kitajs/common';
import path from 'node:path';
import { StringType, ts } from 'ts-json-schema-generator';
import type { SchemaBuilder } from '../schema/builder';
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
    private builder: SchemaBuilder,
    private collector: AstCollector
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

    // Adds kitajs fastify-html plugin
    if (!this.collector.getPlugin('kitaFastifyHtml')) {
      this.collector.addPlugin('kitaFastifyHtml', {
        name: 'kitaFastifyHtml',
        importUrl: '@kitajs/fastify-html-plugin',
        options: {}
      });
    }

    const { url, routeId } = parseUrl(source.fileName, this.config);
    const method = node.name!.getText();

    const route: Route = {
      kind: 'html',
      url,
      controllerMethod: method,
      method: method.toUpperCase() as Uppercase<string>,
      relativePath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters: [],
      customSend: 'html',
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

    return route;
  }
}
