import { Body, BodyProp, Cookie, Header, Path, Query, Req, Reply } from '@kita/runtime';

type Dummy = {
  a: number;
};

//
///
//

/** Executes on get  */
export async function get(
  // /{asd}
  path: Path<'asd'>,

  // /url?asd=123
  queryNamed: Query<'asd'>,

  req: Req,

  res: Reply,

  header: Header<'cache-control'>,

  cookie: Cookie<'auth'>,

  body: Body<Dummy>,

  bodyProp: BodyProp<number, 'asd.asd.asd'>,

  // /url?a=asd&b=123
  query: Query
): Promise<void> {}

/** Executes on any route  */
export async function all(
  // /{asd}
  path: Path<'asd'>,

  header: Header<'cache-control'>,

  bodyProp: BodyProp<number, 'asd.asd.asd'>,

  // /url?a=asd&b=123
  req: Req,

  // /url?asd=123
  queryNamed: Query<'asd'>,

  query: Query,

  cookie: Cookie<'auth'>,

  res: Reply,

  body: Body<Dummy>
): Promise<void> {}
