/**
 * A fastify js plugin to be registered by kita. A Map of this type usually shows all kita's dependencies to work
 * properly.
 */
export interface KitaPlugin {
  /**
   * The import name/path of this plugin to be registered by fastify.
   *
   * @example '@fastify/swagger'
   */
  importUrl: string;

  /** The name of the plugin to be registered by fastify. */
  name: string;
}
