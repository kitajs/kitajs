import deepmerge from 'deepmerge';
import ts from 'typescript';
import { EmptyJsdocError, JsdocAlreadyDefinedError } from '../errors';
import type { BaseRoute } from '../models';
import { RouteSchema } from '../schema';

/**
 * Custom parse info for each of this this's tags
 */
export function applyJsDoc(tag: ts.JSDocTag, route: BaseRoute): void {
  const { name, value } = parseJSDocTag(tag, route.controllerPath);

  switch (name) {
    case 'security':
      // This regex will always match
      const match = value.match(/^(.+?)(?: \[(.+)\])?$/)!;

      const secName = match[1]!;
      const secParams = match[2] ? match[2].split(',').map((p) => p.trim()) : [];

      route.schema = deepmerge(route.schema, {
        security: [{ [secName]: secParams }]
      });

      break;

    case 'tag':
      route.schema = deepmerge(route.schema, {
        tags: [value]
      });

      break;

    case 'summary':
      //@ts-ignore - any type is valid
      if (route.schema.summary) {
        throw new JsdocAlreadyDefinedError(name, route.controllerPath);
      }

      route.schema = deepmerge(route.schema, {
        summary: value
      });

      break;

    case 'description':
      //@ts-ignore - any type is valid
      if (route.schema.description) {
        throw new JsdocAlreadyDefinedError(name, route.controllerPath);
      }

      route.schema = deepmerge<RouteSchema>(route.schema, {
        description: value
      });

      break;

    case 'url':
      route.url = value;

      break;

    case 'operationid':
      if ('operationId' in route.schema) {
        route.schema.operationId = value;
      }

      break;

    default:
    // TODO: Should we warn on unused tags?
  }
}

/**
 * Gets name and value of a JSDoc tag
 */
function parseJSDocTag(tag: ts.JSDocTag, controllerPath: string) {
  const name = tag.tagName.text.trim().toLowerCase();
  const value = typeof tag.comment === 'string' ? tag.comment.trim() : ts.getTextOfJSDocComment(tag.comment)?.trim();

  if (!value) {
    throw new EmptyJsdocError(name, controllerPath);
  }

  return { name, value };
}
