import { ts } from '@kitajs/ts-json-schema-generator';
import { ParamResolver } from '../parameters/base';
import type { BaseRoute } from '../routes/base';
import type { WebsocketRoute } from '../routes/websocket';
import { findRouteName } from '../util/string';
import { NodeData, NodeInfo, NodeResolver } from './base';

export class WebsocketResolver extends NodeResolver {
  override supports({ node }: NodeInfo): boolean {
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
    node,
    kita,
    source
  }: NodeData<ts.FunctionDeclaration>): Promise<BaseRoute | undefined> {
    const { controllerName, routePath } = findRouteName(source.fileName, kita.config);
    const { character, line } = source.getLineAndCharacterOfPosition(
      node.name?.pos ?? node.pos
    );

    const route: WebsocketRoute = {
      templatePath: 'routes/websocket.hbs',
      controllerName,
      url: routePath,
      controllerPath: `${source.fileName}:${line + 1}:${character}`,
      parameters: [],
      schema: {
        // @ts-ignore - Swagger UI should not display websocket routes.
        hide: true
      },
      websocket: true,
      controllerMethod: 'ws',
      method: 'GET'
    };

    // Parameters detection
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

    return route;
  }
}
