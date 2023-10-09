import { RouteSchema } from '@kitajs/common';

export interface Transformer {
  b: 1;
}

export default async function (): Promise<Transformer> {
  return { b: 1 };
}

export function transformSchema(schema: RouteSchema) {
  schema.description = 'Overridden description';
  return schema;
}
