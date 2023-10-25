/**
 * A fastify js plugin to be registered by kita. A Map of this type usually shows all kita's dependencies to work
 * properly.
 */
export interface KitaPlugin {
  /**
   * The import name/path of this plugin to be registered by fastify.
   *
   * @example 'fastify-swagger'
   */
  importUrl: string;

  /** The name of the plugin to be registered by fastify. */
  name: string;

  /** The string object of options to be passed to the plugin. */
  options: Record<
    string,
    | {
        /** Stringified literally, without quotes as any other normal string. */
        _raw: string;
      }
    | unknown
  >;
}

export function stringifyOptions(options: KitaPlugin['options']): string {
  return (
    '{ ' +
    Object.entries(options)
      .map(([key, value]) => {
        if (typeof value === 'object' && value && '_raw' in value) {
          return `${key}: ${value._raw}`;
        }

        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ') +
    ' }'
  );
}
