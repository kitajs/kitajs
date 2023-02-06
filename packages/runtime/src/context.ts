import type { RouteShorthandOptions } from 'fastify';

//@ts-expect-error - ignore unused
export type Route<
  OperationId extends string,
  Config extends RouteShorthandOptions = {}
> = void;

/**
 * ### Async routes only supports transferable data to be used.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#things_that_dont_work_with_structured_clone
 */
//@ts-expect-error - ignore unused
export type AsyncRoute<
  OperationId extends string,
  Config extends RouteShorthandOptions = {}
> = void;

/**
 * WS routes uses a different parameter called Connection
 */
//@ts-expect-error - ignore unused
export type WebsocketRoute<Config extends RouteShorthandOptions = {}> = void;
