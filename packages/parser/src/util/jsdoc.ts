import { EmptyJsdocError, JsdocAlreadyDefinedError, Route, UnknownHttpJsdocError } from '@kitajs/common';
import { ts } from 'ts-json-schema-generator';
import { mergeSchema } from '../schema/helpers';

/** Parses all jsdoc tags of a route function and applies them to the route. */
export function parseJsDocTags(fn: ts.FunctionDeclaration, route: Route) {
  // Base description
  {
    //@ts-expect-error - TODO: Improve jsdoc parsing
    let description = fn.jsDoc?.[0]?.comment;

    if (description) {
      mergeSchema(route, {
        // Allow undefined to remove the description
        description
      });
    }
  }

  for (const tag of ts.getJSDocTags(fn)) {
    const name = tag.tagName.text.trim().toLowerCase();
    const value = typeof tag.comment === 'string' ? tag.comment.trim() : ts.getTextOfJSDocComment(tag.comment)?.trim();

    switch (name) {
      case 'security':
        if (!value) {
          throw new EmptyJsdocError(tag.tagName || tag);
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
          throw new EmptyJsdocError(tag.tagName || tag);
        }

        mergeSchema(route, {
          tags: [value]
        });

        break;

      case 'throws': {
        if (!value) {
          throw new EmptyJsdocError(tag.tagName || tag);
        }

        const numbers = value.split(',').map(Number);

        for (const number of numbers) {
          if (isNaN(number)) {
            throw new UnknownHttpJsdocError(tag.tagName || tag);
          }

          // Adds the route schema
          mergeSchema(route, {
            response: {
              [number]: {
                // This type will be registered by `sharedSchemaId` option
                // from @fastify/sensible
                $ref: 'HttpError'
              }
            }
          });
        }

        break;
      }

      case 'summary':
        if (!value) {
          throw new EmptyJsdocError(tag.tagName || tag);
        }

        //@ts-ignore - any type is valid
        if (route.schema.summary) {
          throw new JsdocAlreadyDefinedError(tag.tagName || tag);
        }

        mergeSchema(route, {
          summary: value
        });

        break;

      case 'description':
        // We don't throw an error if the description is already defined
        // because the inner jsdoc may be for documenting code and the @description
        // may be for documenting the route

        route.schema.description = value;

        break;

      case 'url':
        if (!value) {
          throw new EmptyJsdocError(tag.tagName || tag);
        }

        route.url = value;
        break;

      case 'operationid':
        if (!value) {
          throw new EmptyJsdocError(tag.tagName || tag);
        }

        // Does not override the default operationId
        route.schema.operationId ??= value;
        break;

      case 'deprecated':
        route.schema.deprecated = true;
        break;

      case 'method':
        if (!value) {
          throw new EmptyJsdocError(tag.tagName || tag);
        }

        // changes the operationId to match the method
        route.schema.operationId = value.toLowerCase() + route.schema.operationId.slice(route.method.length);
        route.method = value.toUpperCase();
        break;

      case 'internal': {
        route.schema.hide = true;
        break;
      }

      default:
      // TODO: Should we warn on unused tags?
    }
  }
}
