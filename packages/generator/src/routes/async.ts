import deepmerge from 'deepmerge';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'node:path';
import ts from 'typescript';
import { KitaError } from '../errors';
import { ParamResolver } from '../parameters/base';
import type { AsyncRoute } from '../route';
import { applyJsDoc } from '../util/jsdoc';
import { capitalize, findUrlAndController } from '../util/string';
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

    if (!fn.name?.getText()?.match(/^get|post|put|delete|all$/i)) {
      return false;
    }

    return fn.parameters[0]?.type?.getFirstToken()?.getText() === 'AsyncRoute';
  }

  override async resolve({
    kita,
    node,
    source
  }: CreationData<ts.FunctionDeclaration>): Promise<AsyncRoute | undefined> {
    const fnName = node.name?.getText()!;
    const pos = source.getLineAndCharacterOfPosition(node.name?.pos ?? node.pos);
    const rName = findUrlAndController(source.fileName, kita.config);

    const route: AsyncRoute = {
      controllerMethod: fnName,
      method: fnName.toUpperCase(),
      controllerName: rName.controller,
      url: rName.routePath,
      controllerPath: `${source.fileName}:${pos.line + 1}`,
      parameters: [],
      schema: {
        operationId: `${rName.controller}${capitalize(fnName)}`
      },
      rendered: '',
      importablePath: kita.importablePath(source.fileName),
      async: true
    };

    // Response type detection
    const schema = await kita.schemaStorage.consumeResponseType(node, route);
    route.schema = deepmerge(route.schema, {
      response: { [kita.config.schema.defaultResponse]: schema }
    });

    //@ts-expect-error - TODO: Find correct ts.getJsDoc method
    route.schema = deepmerge(route.schema, { description: node.jsDoc?.[0]?.comment });

    for (const tag of ts.getJSDocTags(node)) {
      applyJsDoc(tag, route);
    }

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

    for (const [resp, schema] of Object.entries(kita.config.schema.responses)) {
      (route.schema.response as Record<string, unknown>)[resp] ??= schema;
    }

    // Add controller import to the result to allow it to import types
    kita.ast.addImport(
      `import * as ${route.controllerName} from '${kita.importablePath(
        source.fileName
      )}';`
    );

    kita.ast.hasAsync = true;
    route.rendered = HbsTemplate(route);

    return route;
  }
}
