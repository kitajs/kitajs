import type { JsonSchema } from '@kitajs/common';
import type { FastifyPluginAsync, FastifyRegisterOptions, RouteOptions } from 'fastify';
import type { ApplicationHook, LifecycleHook } from 'fastify/types/hooks';
import type { Promisable } from 'type-fest';

declare module 'fastify' {
  export interface FastifyRegister {
    /**
     * Register the Kita generated fastify plugin with all routes, schemas and providers.
     *
     * @example
     *
     * ```ts
     * app.register(Kita, {
     *   runtime: import('./runtime.kita'),
     *   plugins: {
     *     myPluginConfig: false, // disables it
     *     myOtherPluginConfig: {
     *       someOption: 'value'
     *     }
     *   }
     * });
     * ```
     *
     * @see {@link https://kita.js.org}
     */
    // biome-ignore lint/style/useShorthandFunctionType: type extension here is necessary to improve JSDocs
    (plugin: typeof Kita, opts: FastifyRegisterOptions<KitaPluginOptions>): void;
  }
}

declare global {
  namespace Kita {
    // biome-ignore lint/suspicious/noEmptyInterface: This type will be extended by the generated runtime
    export interface Plugins {}
  }
}

/** The generated runtime for a Kita application. */
export interface KitaGeneratedRuntime {
  /** @internal property used to detect if a object is a kita runtime */
  __kita?: boolean;

  schemas: JsonSchema[];
  routes: RouteOptions[];
  applicationHooks: [ApplicationHook | LifecycleHook, () => Promise<unknown>][];
  /** Name -> Import Url */
  plugins: Record<string, string>;
}

/**
 * The options for the Kita fastify plugin.
 *
 * @example
 *
 * ```ts
 * app.register(Kita, {
 *   runtime: import('./runtime.kita'),
 *   plugins: {
 *     myPluginConfig: false // disables it
 *   }
 * });
 * ```
 */
export interface KitaPluginOptions {
  runtime: Promisable<KitaGeneratedRuntime | { runtime: KitaGeneratedRuntime }>;
  plugins?: Kita.Plugins;
}

/**
 * The Kita generated fastify plugin.
 *
 * Registering it into your fastify instance will automatically register all routes, schemas and providers.
 *
 * @example
 *
 * ```ts
 * app.register(Kita, {
 *   runtime: import('./runtime.kita'),
 *   plugins: {
 *     myPluginConfig: false // disables it
 *   }
 * });
 * ```
 *
 * @see {@link https://kita.js.org}
 */
export declare const Kita: FastifyPluginAsync<KitaPluginOptions>;
