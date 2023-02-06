import type { Query } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

type Deep = {
  a: { b: number };
};

//@ts-expect-error - should warn about deep query objects
export function get(query: Query<Deep>) {
  return query;
}

type NotDeep =
  | {
      a: number;
      b: string;
    }
  | {
      a: URL[];
      b: string;
    }
  | number[];

export function post(query: Query<NotDeep>) {
  return query;
}

describe('should warn about deep query objects', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it.concurrent('should work for deep objects but tsc will warn', async () => {
    const { KitaAST } = await test;

    const postRoute = KitaAST.routes.find((r) => r.method === 'GET')!;

    expect(postRoute).toBeDefined();
    expect(postRoute.schema.response).toStrictEqual({
      default: {
        $ref: 'ParametersQueryDeepControllerGetResponse'
      }
    });

    const response = KitaAST.schemas.find(
      (s) => s.$id === 'ParametersQueryDeepControllerGetResponse'
    )!;

    expect(response).toBeDefined();
    expect(response).toMatchObject({
      $id: 'ParametersQueryDeepControllerGetResponse',
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: { b: { type: 'number' }},
          required: ['b'],
          additionalProperties: false
        }
      },
      required: ['a'],
      additionalProperties: false
    });
  });

  it.concurrent('should not warn about non deep query objects', async () => {
    const { KitaAST } = await test;

    const postRoute = KitaAST.routes.find((r) => r.method === 'POST')!;

    expect(postRoute).toBeDefined();
    expect(postRoute.schema.response).toStrictEqual({
      default: { $ref: 'ParametersQueryDeepControllerPostResponse' }
    });

    const response = KitaAST.schemas.find(
      (s) => s.$id === 'ParametersQueryDeepControllerPostResponse'
    )!;

    expect(postRoute.schema.response).toBeDefined();

    expect(response).toStrictEqual({
      $id: 'ParametersQueryDeepControllerPostResponse',
      anyOf: [
        {
          type: 'object',
          properties: { a: { type: 'number' }, b: { type: 'string' } },
          required: ['a', 'b'],
          additionalProperties: false
        },
        {
          type: 'object',
          properties: {
            a: { type: 'array', items: { type: 'string', format: 'uri' } },
            b: { type: 'string' }
          },
          required: ['a', 'b'],
          additionalProperties: false
        },
        { type: 'array', items: { type: 'number' } }
      ]
    });
  });
});
