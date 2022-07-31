import {
  Body,
  BodyProp,
  Cookie,
  Path,
  Query,
  Rep,
  Req,
  RouteContext
} from '@kita/runtime';
import { AuthParam } from '../params/auth';

export async function post(
  this: RouteContext,
  path: Path<'name'>,
  cookie: Cookie<'cache-control'>,
  body: Body<{ age: number }>,
  namedBodyProp: BodyProp<number, 'path'>,
  bodyProp: BodyProp<number>,
  query: Query<{ age: number }>,
  namedQuery: Query<'age'>,
  paramQuery: Query,
  _req: Req,
  _rep: Rep,
  authJwt: AuthParam<'jwt'>,
  authBasic: AuthParam<'basic'>
) {
  return {
    path,
    cookie,
    body,
    namedBodyProp,
    bodyProp,
    query,
    namedQuery,
    paramQuery,
    authJwt,
    authBasic
  };
}
