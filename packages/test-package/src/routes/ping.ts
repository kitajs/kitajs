import type { Conn, Route } from '@kitajs/runtime';

/**
 * Websocket route that returns `Pong!` when a message is received.
 */
export function ws(this: Route<'name'>, { socket }: Conn) {
  socket.on('message', () => socket.send('Pong!'));
}
