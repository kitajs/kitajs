import type { Definition } from 'ts-json-schema-generator';

export const schemas = (r: Definition[]) =>
  /* ts */ `

/**
 * All collected route schemas by kitajs.
 */
export const RouteSchemas = ${JSON.stringify(r, null, 2)};

`.trim();
