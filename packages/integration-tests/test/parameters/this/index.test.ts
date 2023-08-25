import type { Route } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

export function get(this: Route<'getname'>) {}

export function post(this: Route<'postname', { bodyLimit: 1 }>) {}

export function put(
  this: Route<
    'putname',
    {
      bodyLimit: 1;
      config: {
        withNewline: true;
      };
    }
  >
) {}

describe('this options variations', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('works', async () => {
    const { KitaAST } = await test;

    expect(KitaAST.routes).toHaveLength(3);

    const [getRoute, postRoute, putRoute] = KitaAST.routes;

    expect(getRoute!.schema.operationId).toBe('getname');
    expect(getRoute!.options).toBeUndefined();

    expect(postRoute!.schema.operationId).toBe('postname');

    let postCode;
    eval(`postCode = { ${postRoute!.options?.replace(/\.\/parameters\/this/g, '.')} }`);
    expect(postCode).toStrictEqual({
      bodyLimit: 1
    });

    expect(putRoute!.schema.operationId).toBe('putname');

    let putCode;
    eval(`putCode = { ${putRoute!.options?.replace(/\.\/parameters\/this/g, '.')} }`);
    expect(putCode).toStrictEqual({
      bodyLimit: 1,
      config: {
        withNewline: true
      }
    });
  });
});
