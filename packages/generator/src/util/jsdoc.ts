import deepmerge from 'deepmerge';
import ts from 'typescript';
import { KitaError } from '../errors';
import type { BaseRoute } from '../v2/models';

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
        throw KitaError(`@${name} tag is already defined.`, route.controllerPath);
      }

      route.schema = deepmerge(route.schema, {
        summary: value
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
      console.error(`@${name} tag is not supported.\n`, route.controllerPath);
  }
}

/**
 * Gets name and value of a JSDoc tag
 */
function parseJSDocTag(tag: ts.JSDocTag, controllerPath: string) {
  const name = tag.tagName.text.toLowerCase();

  const value =
    typeof tag.comment === 'string'
      ? tag.comment.trim()
      : ts.getTextOfJSDocComment(tag.comment)?.trim();

  if (!value) {
    throw KitaError(`@${name} tag must have a comment.`, controllerPath);
  }

  return { name, value };
}
