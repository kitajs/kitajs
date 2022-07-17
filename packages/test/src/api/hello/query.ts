import { Query } from '@kita/runtime';

export async function get(this: KitaContext, name: Query<'name'>, query: Query) {
  console.log({ query, name });

  return `Hello ${name}`;
}
