import type { Route } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

export function get(this: Route<'getname'>) {}

export function post(
  this: Route<
    'postname',
    {
      schema: {
        response: {
          default: {
            type: 'object';
            properties: {
              name: {
                type: 'string';
              };
            };
          };
        };
      };
    }
  >
) {}

describe('this options variations', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('works', async () => {
    const { KitaAST } = await test;

    expect(KitaAST.routes).toHaveLength(2);

    const [getRoute, postRoute] = KitaAST.routes;

    expect(getRoute!.schema.operationId).toBe('getname');
    expect(getRoute!.options).toBeUndefined();
    expect(getRoute!.schema).toStrictEqual({
      operationId: 'getname',
      response: {
        default: {
          type: 'null'
        }
      }
    });

    expect(postRoute!.schema.operationId).toBe('postname');
    expect(postRoute!.options).toBeUndefined();
    expect(postRoute!.schema).toStrictEqual({
      operationId: 'postname',
      response: {
        default: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          }
        }
      }
    });
  });
});
