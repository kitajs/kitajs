import type { Connection, WebsocketRoute } from '@kitajs/runtime';

/**
 * Websocket route that returns `Pong!` when a message is received.
 */
export function ws(this: WebsocketRoute, { socket }: Connection) {
  socket.on('message', () => socket.send('Pong!'));
}
