import { RouteSchema } from '@kitajs/common';

export type MyProvider = { a: 1 };

export default function (): MyProvider {
  return { a: 1 };
}

export function transformSchema(schema: RouteSchema): RouteSchema {
  return schema;
}
