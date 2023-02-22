import ts from 'typescript';
import type { KitaConfig } from '../../config';
import type { SchemaStorage } from '../../schema-storage';
import { applyJsDoc } from '../../util/jsdoc';
import { isNodeExported, isTypeOnlyNode, parametersToAsyncArray } from '../../util/node';
import { findUrlAndController } from '../../util/string';
import type { BaseRoute } from '../base-route';
import type { ParameterParser } from '../parameter-parser';
import { RouteParser } from '../route-parser';
import { RestRoute } from '../routes/rest';

export class RestRouteParser extends RouteParser {
  constructor(
    readonly config: KitaConfig,
    readonly schemaStorage: SchemaStorage,
    readonly paramParser: ParameterParser
  ) {
    super();
  }

  supports(node: ts.Node): boolean {
    if (!isNodeExported(node) || isTypeOnlyNode(node)) {
      return false;
    }

    const fd = node as ts.FunctionDeclaration;

    if (
      node.kind !== ts.SyntaxKind.FunctionDeclaration ||
      !fd.name ||
      !node.getSourceFile()
    ) {
      return false;
    }

    // Allows this parameter to not be defined as this is the last
    // resolver and should try to catch as many routes as possible.
    if (!fd.name.getText().match(/^get|post|put|delete|all$/i)) {
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
    {
      route.mergeSchema({
        response: {
          [this.config.schema.defaultResponse]: this.schemaStorage.consumeResponseType(
            node,
            route.schema.operationId
          )
        }
      });

      for (const [resp, schema] of Object.entries(this.config.schema.responses)) {
        (route.schema.response as Record<string, unknown>)[resp] ??= schema;
      }
    }

    // TODO: Improve jsdoc parsing
    {
      route.mergeSchema({
        //@ts-expect-error - TODO: Find correct ts.getJsDoc method
        description: node.jsDoc?.[0]?.comment
      });

      for (const tag of ts.getJSDocTags(node)) {
        applyJsDoc(tag, route);
      }
    }

    // Parsers parameters assyncronously
    for await (const { index, param, supports } of parametersToAsyncArray(
      node.parameters,
      this.paramParser
    )) {
      if (!supports) {
        continue;
      }

      route.parameters[index] = await this.paramParser.parse(param, index, route, node);
    }

    return route;
  }
}
