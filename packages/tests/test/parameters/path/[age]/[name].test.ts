import type { Path } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../../builder';

export function get(name: Path, age: Path<'age', number>) {
  return { name, age };
}

export function post(name: Path, age: Path<'age', number | string>) {
  return { name, age };
}

describe('should parse name and age correctly', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('should work', async () => {
    const response = await test.inject(get, {
      url: `/parameters/path/${18}/${'Arthur'}`
    });

    expect(response.json<ReturnType<typeof get>>()).toStrictEqual({
      name: 'Arthur',
      age: 18
    });
  });

  it('should work with age string', async () => {
    const response = await test.inject(post, {
      url: `/parameters/path/${'18'}/${'Arthur'}`
    });

    expect(response.json<ReturnType<typeof get>>()).toStrictEqual({
      name: 'Arthur',
      age: '18' // allows string and number
    });
  });

  it('should throw on type error', async () => {
    const response = await test.inject(get, {
      url: `/parameters/path/${'Not a number'}/${'Arthur'}`
    });

    expect(response.json<ReturnType<typeof get>>()).toStrictEqual({
      error: 'Internal Server Error',
      message: '"age" is required!',
      statusCode: 500
    });
  });

  it('ensures correct schema definition', async () => {
    const { KitaAST } = await test;

    const queryGetSchema = KitaAST.schemas.find(
      (s) => s.$id === 'ParametersPath%24age%24%24name%24ControllerGetResponse'
    )!;

    expect(queryGetSchema).toBeDefined();
    expect(queryGetSchema).toStrictEqual({
      $id: 'ParametersPath%24age%24%24name%24ControllerGetResponse',
      type: 'object',
      properties: { name: { type: 'string' }, age: { type: 'number' } },
      required: ['name', 'age'],
      additionalProperties: false
    });

    const queryPostSchema = KitaAST.schemas.find(
      (s) => s.$id === 'ParametersPath%24age%24%24name%24ControllerPostResponse'
    )!;
    
    expect(queryPostSchema).toBeDefined();
    expect(queryPostSchema).toStrictEqual({
      $id: 'ParametersPath%24age%24%24name%24ControllerPostResponse',
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
