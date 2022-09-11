import deepmerge from 'deepmerge';
import { ts } from '@kitajs/ts-json-schema-generator';
import { ParamResolver } from '../parameters/base';
import type { BaseRoute } from '../routes/base';
import type { RestRoute } from '../routes/rest';
import { findRouteName } from '../util/string';
import { NodeData, NodeInfo, NodeResolver } from './base';

export class RestResolver extends NodeResolver {
  override supports({ node }: NodeInfo): boolean {
    return !!(
      // its a function
      (
        node.kind === ts.SyntaxKind.FunctionDeclaration &&
        // its name is a valid http method
        (node as ts.FunctionDeclaration).name
          ?.getText()
          ?.match(/^get|post|put|delete|all$/i)
      )
    );
  }

  override async resolve({
    node,
    kita,
    source
  }: NodeData<ts.FunctionDeclaration>): Promise<BaseRoute | undefined> {
    const fnName = node.name?.getText()!;

    const { controllerName, routePath } = findRouteName(source.fileName, kita.config);
    const { character, line } = source.getLineAndCharacterOfPosition(
      node.name?.pos ?? node.pos
    );

    const route: RestRoute = {
      templatePath: 'routes/rest.hbs',
      controllerName,
      route: routePath,
      controllerPath: `${source.fileName}:${line + 1}:${character}`,
      controllerMethod: fnName,
      parameters: [],
      schema: {},
      method: fnName.toUpperCase()
    };

      // Parameters detection
    const parameters = await ParamResolver.resolveFunction(kita, route, node);
    route.parameters.push(...parameters);
   

    // Response type detection
    const schema = await kita.schemaStorage.consumeResponseType(node, route);
    route.schema = deepmerge(route.schema, {
      response: { default: schema }
    });

    // Add controller import to the result
    kita.ast.addImport(
      `import * as ${route.controllerName} from '${kita.importablePath(
        source.fileName
      )}';`
    );

    return route;
  }
}
