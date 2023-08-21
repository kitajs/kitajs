import type { Body, BodyProp, Cookie, Path, Query, Route } from '@kitajs/runtime';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AuthParam } from '../helpers/auth-param';
import type { NameQuery } from '../models/hello-world';

/**
 * Route description 1
 *
 * @security default
 * @security admin [read-user, write user, 4, 76]
 *
 * @tag test tag 1
 *
 * @summary route summary 1
 */
export async function put(
  this: Route<'fullExampleUsingBody'>,
  path: Path<string, 'name'>,
  cookie: Cookie<'cache-control'>,
  namedBodyProp: BodyProp<number, 'path'>,
  bodyProp: BodyProp<number>,
  paramQuery: Query,
  typedQuery: Query<boolean>,
  typedAndNamedQuery: Query<boolean, 'typedAndNamedQuery'>,
  req: FastifyRequest,
  rep: FastifyReply,
  authJwt: AuthParam<'jwt'>,
  authBasic: AuthParam<'basic'>
) {
  return 1;
}

/**
 * @description route description 2
 *
 * @security default
 * @security admin [read-user, write user, 4, 76]
 *
 * @tag test tag 2
 *
 * @summary route summary 2
 */
export async function post(
  this: Route<'fullExampleExclusiveQuery'>,
  path: Path<string, 'name'>,
  cookie: Cookie<'cache-control'>,
  body: Body<NameQuery>,
  exclusive: Query<NameQuery>,
  req: FastifyRequest,
  rep: FastifyReply,
  authJwt: AuthParam<'jwt'>,
  authBasic: AuthParam<'basic'>
) {
  return 1;
}
