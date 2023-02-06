import type { FastifyReply, FastifyRequest, FastifySchema } from 'fastify';

export type SchemaParam<Option extends boolean> = Option extends true ? 'yes' : 'no';

export function resolver(_req: FastifyRequest, _rep: FastifyReply, option: boolean) {
  return option ? 'yes' : 'no';
}

export async function transformSchema(schema: FastifySchema, option: boolean) {
  schema.headers = {
    type: 'object',
    properties: {
      'x-abc': {
        type: option ? 'boolean' : 'number'
      }
    }
  };

  return schema;
}
