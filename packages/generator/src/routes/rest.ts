import deepmerge from 'deepmerge';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'node:path';
import { ts } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import { ParamResolver } from '../parameters/base';
import type { Route } from '../route';
import { capitalize, findRouteName } from '../util/string';
import { CreationData, RouteResolver } from './base';

const templatePath = path.resolve(__dirname, '../../templates/rest.hbs');
const templateStr = fs.readFileSync(templatePath, 'utf-8');
const HbsTemplate = Handlebars.compile(templateStr, { noEscape: true });

export class RestResolver extends RouteResolver<ts.FunctionDeclaration> {
  override supports(node: ts.Node): boolean {
    // its a function
    return !!(
      node.kind === ts.SyntaxKind.FunctionDeclaration &&
      // its name is a valid http method
      (node as ts.FunctionDeclaration).name
        ?.getText()
        ?.match(/^get|post|put|delete|all$/i)
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
    route.schema = deepmerge(route.schema, { response: { default: schema } });

    //@ts-expect-error - TODO: Find correct ts.getJsDoc method
    route.schema = deepmerge(route.schema, { description: node.jsDoc?.[0]?.comment });

    for (const tag of ts.getJSDocTags(node)) {
      parseTag(tag, route);
    }

    // Add controller import to the result
    kita.ast.addImport(
      `import * as ${route.controllerName} from '${kita.importablePath(
        source.fileName
      )}';`
    );

    route.rendered = HbsTemplate(route);

    return route;
  }
}

/**
 * Custom parse info for each of this this's tags
 */
function parseTag(tag: ts.JSDocTag, route: Route): void {
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
        throw KitaError(
          //@ts-ignore - any type is valid
          `A description for this this is already defined. (${route.schema.description})`,
          route.controllerPath
        );
      }

      route.schema = deepmerge(route.schema, {
        description: comment
      });

      break;
  }
}
