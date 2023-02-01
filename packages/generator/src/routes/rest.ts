import deepmerge from 'deepmerge';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'node:path';
import { ts } from 'ts-json-schema-generator';
import { ParamResolver } from '../parameters/base';
import type { Route } from '../route';
import { applyJsDoc } from '../util/jsdoc';
import { capitalize, findRouteName } from '../util/string';
import { CreationData, RouteResolver } from './base';

const templatePath = path.resolve(__dirname, '../../templates/rest.hbs');
const templateStr = fs.readFileSync(templatePath, 'utf-8');
const HbsTemplate = Handlebars.compile(templateStr, { noEscape: true });

export class RestResolver extends RouteResolver<ts.FunctionDeclaration> {
  override supports(node: ts.Node): boolean {
    if (node.kind !== ts.SyntaxKind.FunctionDeclaration) {
      return false;
    }

    const fn = node as ts.FunctionDeclaration;

    return (
      fn.parameters[0]?.type?.getFirstToken()?.getText() !== 'AsyncRoute' &&
      // its name is a valid http method
      !!fn.name?.getText()?.match(/^get|post|put|delete|all$/i)
    );
  }

  override async resolve({
    kita,
    node,
    source
  }: CreationData<ts.FunctionDeclaration>): Promise<Route | undefined> {
    const fnName = node.name?.getText()!;
    const pos = source.getLineAndCharacterOfPosition(node.name?.pos ?? node.pos);
    const rName = findRouteName(source.fileName, kita.config);

    const route: Route = {
      controllerMethod: fnName,
      method: fnName.toUpperCase(),
      controllerName: rName.controllerName,
      url: rName.routePath,
      controllerPath: `${source.fileName}:${pos.line + 1}`,
      parameters: [],
      schema: {
        operationId: `${rName.controllerName}${capitalize(fnName)}`
      },
      rendered: ''
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
        index
      );

      if (parameter) {
        route.parameters.push(parameter);
      }
    }

    // Add controller import to the result
    kita.ast.addImport(
      `import * as ${route.controllerName} from '${kita.importablePath(
        source.fileName
      )}';`
    );

    for (const [resp, schema] of Object.entries(kita.config.schema.responses)) {
      (route.schema.response as Record<string, unknown>)[resp] ??= schema;
    }

    route.rendered = HbsTemplate(route);

    return route;
  }
}
