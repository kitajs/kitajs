import { Query, RouteContext } from '@kita/runtime';
import { AuthParam } from '../../kita';

// export async function get(
//   this: RouteContext,
//   name: Query<'name'>,
//   query: Query,
//   custom: AuthParam
// ) {
//   console.log({ query, name, custom });
//   return `Hello ${name}`;
// }

export async function post(
  this: RouteContext,
  query1: Query<{ age: number }>,
  query2: Query<'name'>,
  custom: AuthParam
) {
  console.log({ query1, query2,  custom });

  return `Hello ${query2}`;
}
