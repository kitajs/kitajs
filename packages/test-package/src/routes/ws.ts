import type { Conn, Req, Route, Sock } from '@kitajs/runtime';

export function ws(this: Route<'name'>, conn: Conn, sock: Sock, req: Req) {
  return 123123123
}
