import type { Path } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../../builder';

export function get(name: Path, age: Path<number>) {
  return { name, age };
}

export function post(name: Path, age: Path<number | string>) {
  return { name, age };
}

export function put(name: Path, notAge: Path<number | string, 'age'>) {
  return { name, notAge };
}

describe('should parse name and age correctly', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it.concurrent('should work', async () => {
    const response = await test.inject(get, {
      url: `/parameters/path/${18}/${'Arthur'}`
    });

    expect(response.json<ReturnType<typeof get>>()).toStrictEqual({
      name: 'Arthur',
      age: 18
    });
  });

  it.concurrent('should work with age string', async () => {
    const response = await test.inject(post, {
      url: `/parameters/path/${'18'}/${'Arthur'}`
    });

    expect(response.json<ReturnType<typeof get>>()).toStrictEqual({
      name: 'Arthur',
      age: '18' // allows string and number
    });
  });

  it.concurrent('should throw on type error', async () => {
    const response = await test.inject(get, {
      url: `/parameters/path/${'Not a number'}/${'Arthur'}`
    });

    expect(response.json<ReturnType<typeof get>>()).toStrictEqual({
      error: 'Internal Server Error',
      message: '"age" is required!',
      statusCode: 500
    });
  });

  it.concurrent('ensures correct schema definition', async () => {
    const { KitaAST } = await test;

    const queryGetSchema = KitaAST.schemas.find(
      (s) => s.$id === 'ParametersPath_age__name_ControllerGetResponse'
    )!;

    expect(queryGetSchema).toBeDefined();
    expect(queryGetSchema).toStrictEqual({
      $id: 'ParametersPath_age__name_ControllerGetResponse',
      type: 'object',
      properties: { name: { type: 'string' }, age: { type: 'number' } },
      required: ['name', 'age'],
      additionalProperties: false
    });

    const queryPostSchema = KitaAST.schemas.find(
      (s) => s.$id === 'ParametersPath_age__name_ControllerPostResponse'
    )!;

    expect(queryPostSchema).toBeDefined();
    expect(queryPostSchema).toStrictEqual({
      $id: 'ParametersPath_age__name_ControllerPostResponse',
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: ['string', 'number'] }
      },
      required: ['name', 'age'],
      additionalProperties: false
    });
  });
});
