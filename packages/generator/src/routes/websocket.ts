import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'node:path';
import { ts } from 'ts-json-schema-generator';
import type { Node } from 'typescript';
import { ParamResolver } from '../parameters/base';
import type { WebsocketRoute } from '../route';
import { findRouteName } from '../util/string';
import { CreationData, RouteResolver } from './base';

const templatePath = path.resolve(__dirname, '../../templates/websocket.hbs');
const templateStr = fs.readFileSync(templatePath, 'utf-8');
const HbsTemplate = Handlebars.compile(templateStr, { noEscape: true });

export class WebsocketResolver extends RouteResolver<ts.FunctionDeclaration> {
  override supports(node: Node): boolean {
    return !!(
      // its a function
      (
        node.kind === ts.SyntaxKind.FunctionDeclaration &&
        // its fn name is ws
        (node as ts.FunctionDeclaration).name?.getText()?.match(/^ws$/i)
      )
    );
  }

  override async resolve({
    kita,
    node,
    source
  }: CreationData<ts.FunctionDeclaration>): Promise<WebsocketRoute | undefined> {
    const pos = source.getLineAndCharacterOfPosition(node.name?.pos ?? node.pos);
    const rName = findRouteName(source.fileName, kita.config);

    const route: WebsocketRoute = {
      controllerMethod: 'ws',
      method: 'GET',
      controllerName: rName.controllerName,
      url: rName.routePath,
      controllerPath: `${source.fileName}:${pos.line + 1}`,
      parameters: [],
      schema: { hide: true },
      rendered: '',
      websocket: true
    };

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
