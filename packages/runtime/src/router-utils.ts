import { RouteContext } from './context';
import { Rep, Req } from './parameters';

/// Check if a status code was previously set.
const { kReplyHasStatusCode } = require('fastify/lib/symbols');

export async function sendResponse<T>(
  this: RouteContext,
  _request: Req,
  reply: Rep,
  promise: Promise<T> | T
): Promise<void> {
  const data = await promise;

  // Some cases, this handler gets executed after the route sent a response.
  if (reply.sent) {
    return undefined as any;
  }

  // Router did not specified a status code, so we set it to 200 or 204.
  //@ts-expect-error - Fastify omits this type.
  if (!reply[kReplyHasStatusCode]) {
    reply.status(data === null || data === undefined ? 204 : 200);
  }

  // Sends the returned data.
  reply.send(data);
}
