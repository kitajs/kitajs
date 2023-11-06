import { RouteSchema } from '@kitajs/common';

export type MyProvider = { a: 1 };

export default function () /*  UntypedProviderError */ {
  return { a: 1 } as MyProvider;
}

// No errors should be thrown for this method
export function transformSchema(schema: RouteSchema): RouteSchema {
  return schema;
}
