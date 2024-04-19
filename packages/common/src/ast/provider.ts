import type ts from 'typescript';
import type { Parameter } from './parameter';
import type { Route } from './route';

/** The AST definition for a kitajs provider. */
export interface Provider {
  /** The path to the provider route */
  providerPath: string;

  /** If this provider has a schema transformer attached to it */
  schemaTransformer: boolean;

  /**
   * The type of the provider
   *
   * @example MyCustomProvider
   */
  type: string;

  /** If this provider is async */
  async: boolean;

  /**
   * A name of all hooks that are attached to this provider.
   *
   * They must follow this signature `(this: FastifyInstance) => Promise<void>`
   *
   * @see {@linkcode ApplicationHookNames}
   */
  applicationHooks: string[];

  /**
   * A name of all hooks that are attached to this provider.
   *
   * They must follow this signature `(this: FastifyInstance, request: FastifyRequest, reply: FastifyReply) =>
   * Promise<void>`
   *
   * @see {@linkcode LifecycleHookNames}
   */
  lifecycleHooks: string[];

  /** Parses all parameters taking into account a specific route */
  parseParameters: (this: void, route: Route, parameterNode: ts.ParameterDeclaration) => Parameter[];
}

export const ApplicationHookNames = ['onRoute', 'onRegister', 'onReady', 'onListen', 'onClose', 'preClose'] as const;

export const LifecycleHookNames = [
  'onRequest',
  'preParsing',
  'preValidation',
  'preHandler',
  'preSerialization',
  'onSend',
  'onResponse',
  'onRequest',
  'onError',
  'onTimeout',
  'onRequestAbort'
] as const;
