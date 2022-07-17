import { KitaConfig } from '@kita/core';
import {
  Path,
  BodyProp,
  Query,
  Header,
  Cookie,
  Req,
  Reply,
  Body
} from '@kita/runtime';

type Dummy = {
  a: number;
};

/** Executes on any route  */
export async function all(
  this: KitaContext,
  // /{asd}
  path: Path<'asd'>,

  body: Body<Dummy>,

  bodyProp: BodyProp<number, 'asd.asd.asd'>,

  // /url?a=asd&b=123
  query: Query,

  // /url?asd=123
  queryNamed: Query<'asd'>,

  header: Header<'cache-control'>,

  cookie: Cookie<'auth'>,

  req: Req,

  res: Reply
): Promise<void> {}
