import deepmerge from 'deepmerge';
import { ts } from '@kitajs/ts-json-schema-generator';
import { ParamResolver } from '../param-resolvers/base';
import type { BaseRoute } from '../routes/base';
import type { RestRoute } from '../routes/rest';
import { findRouteName } from '../util/string';
import { NodeData, NodeInfo, NodeResolver } from './base';
import { KitaError } from '../errors';

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
      url: routePath,
      controllerPath: `${source.fileName}:${line + 1}:${character}`,
      controllerMethod: fnName,
      parameters: [],
      schema: {},
      method: fnName.toUpperCase()
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

    // Response type detection
    const schema = await kita.schemaStorage.consumeResponseType(node, route);
    route.schema = deepmerge(route.schema, {
      response: { default: schema }
    });

    //@ts-expect-error - TODO: Find correct ts.getJsDoc method
    const description = node.jsDoc?.[0]?.comment;
    if (description) {
      route.schema = deepmerge(route.schema, { description });
    }

    // Parse JSDoc tags
    ts.getJSDocTags(node).forEach((tag) => this.parseTag(tag, route));

    // Add controller import to the result
    kita.ast.addImport(
      `import * as ${route.controllerName} from '${kita.importablePath(
        source.fileName
      )}';`
    );

    return route;
  }

  /**
   * Custom parse info for each of this route's tags
   */
  parseTag(tag: ts.JSDocTag, route: BaseRoute): any {
    const name = tag.tagName.getText().toLowerCase();
    const comment =
      typeof tag.comment === 'string'
        ? tag.comment.trim()
        : ts.getTextOfJSDocComment(tag.comment)?.trim();

    if (!comment) {
      throw KitaError(`@${name} tag must have a comment.`, route.controllerPath);
    }

    switch (name) {
      case 'security':
        const match = comment.match(/^(.+?)(?: \[(.+)\])?$/)!;

        if (!match) {
          throw KitaError(
            `@${name} tag should follow \`@security <securityName> [<params>]?\` format.`,
            route.controllerPath
          );
        }

        const secName = match[1]!;
        const secParams = match[2] ? match[2].split(',').map((p) => p.trim()) : [];

        route.schema = deepmerge(route.schema, {
          security: [{ [secName]: secParams }]
        });

        break;

      case 'tag':
        route.schema = deepmerge(route.schema, {
          tags: [comment]
        });

        break;

      case 'summary':
        //@ts-ignore - any type is valid
        if (route.schema.summary) {
          throw KitaError(`@${name} tag is already defined.`, route.controllerPath);
        }

        route.schema = deepmerge(route.schema, {
          summary: comment
        });

        break;

      case 'description':
        //@ts-ignore - any type is valid
        if (route.schema.description) {
          //@ts-ignore - any type is valid
          throw KitaError(`A description for this route is already defined. (${route.schema.description})`, route.controllerPath);
        }

        route.schema = deepmerge(route.schema, {
          description: comment
        });

        break;
    }
  }
}
