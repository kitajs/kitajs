import type { RouteShorthandOptions } from 'fastify';

/**
 * Needs @fastify/websocket to be installed.
 *
 * @example
 * ```ts
 * export function myOperationId(this: WsRoute, { socket }: SocketStream) {}
 * ```
 */
export type WsRoute<_Config extends RouteShorthandOptions = {}> = void;
