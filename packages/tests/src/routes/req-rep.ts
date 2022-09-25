import type { Rep, Req } from '@kitajs/runtime';

export function get(req: Req, rep: Rep) {
  rep.header('test', true);
  return req.method;
}

export function post(rep: Rep) {
 expect(rep).toBeDefined()
}

export function put(rep: Rep) {
  rep.send({ custom: 'Custom send with return clause' });

  return 'this will throw an error';
}
