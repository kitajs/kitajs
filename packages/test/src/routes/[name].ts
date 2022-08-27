// import type { Body, Cookie, Path, Query, Rep, Req, Route } from '@kitajs/runtime';
// import type { AuthParam } from '../helpers/auth-param';
// import type { NameQuery } from '../models/hello-world';

// Commented code works, but not all together.

// FIXME: Broken
// export async function post(
//   this: Route<'postUser'>,
//   path: Path<'name'>,
//   cookie: Cookie<'cache-control'>,
//   body: Body<NameQuery>,
//   // namedBodyProp: BodyProp<number, 'path'>,
//   // bodyProp: BodyProp<number>,
//   query: Query<NameQuery>,
//   // namedQuery: Query<'age'>,
//   // paramQuery: Query,
//   _req: Req,
//   _rep: Rep,
//   authJwt: AuthParam<'jwt'>,
//   authBasic: AuthParam<'basic'>
// ) {
//   return {
//     path,
//     cookie,
//     body,
//     // namedBodyProp,
//     // bodyProp,
//     query,
//     // namedQuery,
//     // paramQuery,
//     authJwt,
//     authBasic
//   };
// }

export {};
