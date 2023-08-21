import ts from 'typescript';
import type { KitaConfig } from '../config';
import { ParameterResolverNotFoundError } from '../errors';
import type { BaseRoute } from '../models';
import type { ParameterParser, RouteParser } from '../parsers';
import { RestRoute } from '../routes/rest';
import type { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { applyJsDoc } from '../util/jsdoc';
import { getReturnType, isExportedFunction, toPrettySource } from '../util/nodes';
import { findUrlAndController } from '../util/string';

export class RestRouteParser implements RouteParser {
  constructor(
    readonly config: KitaConfig,
    readonly schema: SchemaBuilder,
    readonly paramParser: ParameterParser,
    readonly typeChecker: ts.TypeChecker
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

  async parse(node: ts.FunctionDeclaration): Promise<BaseRoute> {
    const source = node.getSourceFile();

    const { url, controller } = findUrlAndController(source.fileName, this.config);

    const route = new RestRoute(
      node.name!.getText(),
      url,
      controller,
      source.fileName,
      source.getLineAndCharacterOfPosition(node.name?.pos ?? node.pos)
    );

    // Adds response types
    mergeSchema(route, {
      response: {
        [this.config.schema.defaultResponse]: this.schema.consumeNodeSchema(
          getReturnType(node, this.typeChecker),
          `${route.schema.operationId}Response`
        )
      }
    });

    for (const [resp, schema] of Object.entries(this.config.schema.responses)) {
      mergeSchema(route, { response: { [resp]: schema } });
    }

    // TODO: Improve jsdoc parsing
    mergeSchema(route, {
      //@ts-expect-error - TODO: Find correct ts.getJsDoc method
      description: node.jsDoc?.[0]?.comment
    });

    for (const tag of ts.getJSDocTags(node)) {
      applyJsDoc(tag, route);
    }

    // TODO: Transform this to an async iterator to handle parameters asynchronously
    for (const [index, param] of node.parameters.entries()) {
      const supports = await this.paramParser.supports(param);

      if (!supports) {
        throw new ParameterResolverNotFoundError(toPrettySource(param));
      }

      route.parameters[index] = await this.paramParser.parse(param, route, node, index);
    }

    return route;
  }
}
