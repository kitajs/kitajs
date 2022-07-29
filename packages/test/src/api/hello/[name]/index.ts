import { Path,RouteContext } from '@kita/runtime';

export async function get(this: RouteContext, name: Path<'name'>) {
  return { a: `Hello ${name}`, b: Math.random() };
}
