import type { Rep, Req } from '@kitajs/runtime';

export function get(req: Req, rep: Rep) {
  rep.header('test', true);
  return req.method;
}
