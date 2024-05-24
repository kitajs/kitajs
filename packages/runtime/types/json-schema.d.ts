/**
 * Simply returns a options object to be used with `env-schema` to load all possible references contained in your
 * `KitaSchemas`.
 *
 * @param schemas Your `KitaSchemas` object exported from your `runtime.kita.ts` file.
 */
export function addAjvSchemas(schemas: Record<string, object>): { customOptions(ajv: any): any };
