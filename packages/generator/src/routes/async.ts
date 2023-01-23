import deepmerge from 'deepmerge';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'node:path';
import { ts } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import { ParamResolver } from '../parameters/base';
import type { AsyncRoute } from '../route';
import { capitalize, findRouteName } from '../util/string';
import { CreationData, RouteResolver } from './base';

const templatePath = path.resolve(__dirname, '../../templates/async.hbs');
const templateStr = fs.readFileSync(templatePath, 'utf-8');
const HbsTemplate = Handlebars.compile(templateStr, { noEscape: true });

export class AsyncResolver extends RouteResolver<ts.FunctionDeclaration> {
  override supports(node: ts.Node): boolean {
    if (node.kind !== ts.SyntaxKind.FunctionDeclaration) {
      return false;
    }

    const fn = node as ts.FunctionDeclaration;

    return (
      // This parameter is required
      fn.parameters[0]?.name.getText() === 'this' &&
      // type is AsyncRoute
      fn.parameters[0]?.type?.getFirstToken()?.getText() === 'AsyncRoute'
    );
  }

  override async resolve({
    kita,
    node,
    source
  }: CreationData<ts.FunctionDeclaration>): Promise<AsyncRoute | undefined> {
    const fnName = node.name?.getText()!;
    const pos = source.getLineAndCharacterOfPosition(node.name?.pos ?? node.pos);
    const rName = findRouteName(source.fileName, kita.config);

    const route: AsyncRoute = {
      controllerMethod: fnName,
      method: fnName.toUpperCase(),
      controllerName: rName.controllerName,
      url: rName.routePath,
      controllerPath: `${source.fileName}:${pos.line + 1}`,
      parameters: [],
      schema: {
        operationId: `${rName.controllerName}${capitalize(fnName)}`
      },
      rendered: '',
      importablePath: kita.importablePath(source.fileName),
      async: true
    };

    // Response type detection
    const schema = await kita.schemaStorage.consumeResponseType(node, route);
    route.schema = deepmerge(route.schema, { response: { default: schema } });

    //@ts-expect-error - TODO: Find correct ts.getJsDoc method
    route.schema = deepmerge(route.schema, { description: node.jsDoc?.[0]?.comment });

    // Needs to process each parameter in their expected order
    for (const [index, param] of node.parameters.entries()) {
      const parameter = await ParamResolver.resolveParameter(
        kita,
        route,
        node,
        param,
        index,
        (resolver) => {
          const { serializable } = resolver.constructor as typeof ParamResolver;

          if (!serializable) {
            throw KitaError(
              `Parameter ${param.name.getText()} is not compatible with async routes.`,
              route.controllerPath
            );
          }

          return serializable;
        }
      );

      if (parameter) {
        route.parameters.push(parameter);
      }
    }

    kita.ast.hasAsync = true;
    route.rendered = HbsTemplate(route);

    return route;
  }
}
