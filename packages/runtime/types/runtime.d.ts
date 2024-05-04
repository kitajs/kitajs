import type { JsonSchema } from '@kitajs/common';
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyRegisterOptions,
  RouteOptions
} from 'fastify';
import type { ApplicationHook, LifecycleHook } from 'fastify/types/hooks';

declare module 'fastify' {
  export interface FastifyRegister {
    // biome-ignore lint/style/useShorthandFunctionType: type extension here is necessary to allow generic trickery
    <const R extends KitaGeneratedRuntime>(
      plugin: typeof Kita<R>,
      opts: FastifyRegisterOptions<KitaPluginOptions<R>>
    ): void;
  }
}

/** The generated runtime for a Kita application. */
export interface KitaGeneratedRuntime<B = unknown> {
  schemas: JsonSchema[];
  routes: RouteOptions[];
  applicationHooks: [ApplicationHook | LifecycleHook, () => Promise<unknown>][];
  plugins: Record<string, [FastifyPluginAsync | FastifyPluginCallback, any]>;
  /** @internal property to allow type branding */
  __brand?: B | undefined;
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
 *     myPlugin: false
 *   }
 * });
 * ```
 */
export interface KitaPluginOptions<R extends KitaGeneratedRuntime> {
  runtime: Promise<{ runtime: R }>;
  plugins: R['__brand'];
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
 *   runtime: import('./runtime.kita')
 * });
 * ```
 *
 * @see {@link https://kita.js.org}
 */
export function Kita<const R extends KitaGeneratedRuntime>(
  instance: FastifyInstance,
  options: KitaPluginOptions<R>
): Promise<void>;
