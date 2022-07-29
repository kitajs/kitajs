import { Query, RouteContext } from '@kita/runtime';
import { AuthParam } from '../../params/auth';

export async function get(
  this: RouteContext,
  query1: Query<{ age: number }>,
  query2: Query<'name'>,
  custom: AuthParam<'jwt'>
) {
  console.log({ query1, query2, custom });

  if (custom === 'ok') {
  }

  return `Hello ${query2}`;
}
