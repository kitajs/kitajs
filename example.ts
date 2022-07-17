///
//

export type Path<Name extends string> = string;
export type Cookie<Name extends String> = string | number | boolean;
export type Body<Obj> = Obj;
export type BodyProp<T, Path extends string> = T;
export type Query<Name extends string | true = true> = string;
export type Header<Name extends String> = string;
export type Req = Request;
export type Reply = Response;
export type Next = () => void;

//
///
//

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

  body: Body<Dummy>,

  // /url?a=asd&b=123
  query: Query,

  // /url?asd=123
  queryNamed: Query<'asd'>,

  header: Header<'Cache-Control'>,

  cookie: Cookie<'auth'>,

  req: Req,

  res: Reply,

  next: Next
): Promise<void> {}

/** Executes on any route  */
export async function route(
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

  res: Reply,

  next: Next
): Promise<void> {}
