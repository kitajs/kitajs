import type { Route, RouteSchema } from '@kitajs/common';
import deepmerge from 'deepmerge';
import { type TypeFormatter } from 'ts-json-schema-generator';

/** Combines a route schema with a new schema. */
export function mergeSchema(route: Route, schema: Partial<RouteSchema>) {
  route.schema = deepmerge(schema, route.schema);
}

/**
 * Creates a type formatter that removes the `#/definitions/` prefix from `$ref` properties.
 *
 * This was a proposed option in ts-json-schema-generator, buy ruled out as out of scope.
 *
 * @see https://github.com/vega/ts-json-schema-generator/pull/1386
 */
export function removeFormatterDefinitions(typeFormatter: TypeFormatter) {
  const getDefinition = typeFormatter.getDefinition.bind(typeFormatter);

  typeFormatter.getDefinition = function (type) {
    // Calls the original getDefinition function.
    const def = getDefinition(type);

    // Remove the `#/definitions/` prefix from the $ref property.
    if (def.$ref) {
      def.$ref = def.$ref.replace(/^\#\/definitions\//g, '');
    }

    return def;
  };

  return typeFormatter;
}

/**
 * This is a workaround to move the response definition field to the end of the object.
 *
 * It's necessary for when the response references another definition that was not defined yet.
 *
 * Which throws a reference error at runtime because the referenced def was going to be defined after the response
 * definition
 */
export function correctFormatterChildrenOrder(typeFormatter: TypeFormatter) {
  const getChildren = typeFormatter.getChildren.bind(typeFormatter);

  typeFormatter.getChildren = function (type) {
    const children = getChildren(type);

    // The original type is always the first child
    const first = children.shift();
    first && children.push(first);

    return children;
  };

  return typeFormatter;
}
