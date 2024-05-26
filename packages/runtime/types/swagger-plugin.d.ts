import type { FastifyPluginAsync } from 'fastify';

export interface KitaSwaggerPluginOptions {
  /**
   * If false, completely disables the plugin, good for when you only want this in development mode.
   *
   * @default true
   */
  when?: boolean;

  /**
   * The path to write the final Open API definition file to.
   *
   * Use false to disable writing the Open API definition to a file.
   *
   * @default 'openapi.json'
   */
  file?: string | false;

  /**
   * If true, the Open API definition will be pretty printed.
   *
   * @default true
   */
  pretty?: boolean;

  /**
   * Which url path to expose the Open API definition at.
   *
   * Use false to disable exposing the Open API definition.
   *
   * @default '/openapi.json'
   */
  expose?: string | false;
}

/**
 * A swagger extension for Kita applications to automatically serve Open API definitions and auto write the final
 * swagger file.
 *
 * @see https://kita.js.org
 */
export declare const KitaSwagger: FastifyPluginAsync<KitaSwaggerPluginOptions>;
