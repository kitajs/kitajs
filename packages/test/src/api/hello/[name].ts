import { Path } from '@kita/runtime';

export async function get(this: KitaContext, name: Path<'name'>) {
  return { a: `Hello ${name}`, b: Math.random() };
}
