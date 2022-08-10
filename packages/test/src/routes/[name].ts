import type { Body, Cookie, Path, Query, Rep, Req, Route } from '@kitajs/runtime';
import type { B } from '../a';
import type { AuthParam } from '../helpers/auth-param';

// Commented code works, but not all together.

export async function post(
  this: Route<'postUser'>,
  path: Path<'name'>,
  cookie: Cookie<'cache-control'>,
  body: Body<B>,
  // namedBodyProp: BodyProp<number, 'path'>,
  // bodyProp: BodyProp<number>,
  query: Query<B>,
  // namedQuery: Query<'age'>,
  // paramQuery: Query,
  _req: Req,
  _rep: Rep,
  authJwt: AuthParam<'jwt'>,
  authBasic: AuthParam<'basic'>
) {
  return {
    path,
    cookie,
    body,
    // namedBodyProp,
    // bodyProp,
    query,
    // namedQuery,
    // paramQuery,
    authJwt,
    authBasic
  };
}
