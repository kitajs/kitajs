import type {
  BodyProp,
  Cookie,
  Path,
  Query,
  Rep,
  Req,
  Body,
  Route
} from '@kitajs/runtime';
import type { AuthParam } from '../helpers/auth-param';
import type { NameQuery } from '../models/hello-world';

// Commented code works, but not all together.

export async function get(
  this: Route<'fullExampleUsingBody'>,

  path: Path<'name'>,

  cookie: Cookie<'cache-control'>,

  // body: Body<NameQuery>,
  namedBodyProp: BodyProp<number, 'path'>,
  bodyProp: BodyProp<number>,

  paramQuery: Query,
  typedQuery: Query<boolean>,
  namedQuery: Query<'namedQuery'>,
  typedAndNamedQuery: Query<boolean, 'typedAndNamedQuery'>,
  // exclusive: Query<NameQuery>,

  _req: Req,
  _rep: Rep,

  authJwt: AuthParam<'jwt'>,
  authBasic: AuthParam<'basic'>
) {
  return 1;
}

export async function post(
  this: Route<'fullExampleExclusiveQuery'>,

  path: Path<'name'>,

  cookie: Cookie<'cache-control'>,

  body: Body<NameQuery>,
  // namedBodyProp: BodyProp<number, 'path'>,
  // bodyProp: BodyProp<number>,

  // paramQuery: Query,
  // typedQuery: Query<boolean>,
  // namedQuery: Query<'named'>,
  // typedAndNamedQuery: Query<boolean, 'customName'>,
  exclusive: Query<NameQuery>,

  _req: Req,
  _rep: Rep,

  authJwt: AuthParam<'jwt'>,
  authBasic: AuthParam<'basic'>
) {
  return 1;
}
