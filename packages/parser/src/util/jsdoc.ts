import { EmptyJsdocError, JsdocAlreadyDefinedError, Route } from '@kitajs/common';
import ts from 'typescript';
import { mergeSchema } from '../schema/helpers';

/**
 * Parses all jsdoc tags of a route function and applies them to the route.
 */
export function parseJsDocTags(fn: ts.FunctionDeclaration, route: Route) {
  //@ts-expect-error - TODO: Improve jsdoc parsing
  let description = fn.jsDoc?.[0]?.comment;

  for (const tag of ts.getJSDocTags(fn)) {
    const name = tag.tagName.text.trim().toLowerCase();
    const value = typeof tag.comment === 'string' ? tag.comment.trim() : ts.getTextOfJSDocComment(tag.comment)?.trim();

    switch (name) {
      case 'security':
        if (!value) {
          throw new EmptyJsdocError(name, route.controllerPrettyPath);
        }

        // This regex will always match
        const match = value.match(/^(.+?)(?: \[(.+)\])?$/)!;

        const secName = match[1]!;
        const secParams = match[2] ? match[2].split(',').map((p) => p.trim()) : [];

        mergeSchema(route, {
          security: [{ [secName]: secParams }]
        });

        break;

      case 'tag':
        if (!value) {
          throw new EmptyJsdocError(name, route.controllerPrettyPath);
        }

        mergeSchema(route, {
          tags: [value]
        });

        break;

      case 'summary':
        if (!value) {
          throw new EmptyJsdocError(name, route.controllerPrettyPath);
        }

        //@ts-ignore - any type is valid
        if (route.schema.summary) {
          throw new JsdocAlreadyDefinedError(name, route.controllerPath);
        }

        mergeSchema(route, {
          summary: value
        });

        break;

      case 'description':
        // We don't throw an error if the description is already defined
        // because the inner jsdoc may be for documenting code and the @description
        // may be for documenting the route

        mergeSchema(route, {
          // Allow undefined to remove the description
          description: value
        });

        break;

      case 'url':
        if (!value) {
          throw new EmptyJsdocError(name, route.controllerPrettyPath);
        }

        route.url = value;
        break;

      case 'operationid':
        if (!value) {
          throw new EmptyJsdocError(name, route.controllerPrettyPath);
        }

        // Does not override the default operationId
        route.schema.operationId ??= value;
        break;

      case 'deprecated':
        route.schema.deprecated = true;
        break;

      case 'method':
        if (!value) {
          throw new EmptyJsdocError(name, route.controllerPrettyPath);
        }

        route.method = value.toUpperCase();
        break;

      default:
      // TODO: Should we warn on unused tags?
    }
  }
}
