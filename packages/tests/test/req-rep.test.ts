import type { Rep, Req } from '@kitajs/runtime';
import { testRoute } from './setup';

export function get(req: Req, rep: Rep) {
  expect(req.headers.custom).toBe('test');

  rep.header('custom', 'test2');
}

testRoute({
  fn: get,
  exports,
  __filename,
  inject: {
    headers: {
      custom: 'test'
    }
  },
  onResponse(res) {
    expect(res.headers.custom).toBe('test2');
  }
});
