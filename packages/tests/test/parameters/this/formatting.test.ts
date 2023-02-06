import type { Route } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

export function get(
  this: Route<
    'getname',
    // prettier-ignore
    {
      bodyLimit: 1

      config: {
        withNewline: true;

        withTrailingComma: true,
      }
      ,
      withoutTrailingComma:
      
      
      
      {

                    },

      withDefaultImport: 
      
      
      typeof import('./code');

withAImport: typeof import('./code').a,

                                                            withABimports: [typeof import('./code').a, typeof import('./code').b],

withABimportsAndComma: [typeof import('./code').a, typeof import('./code').b,], withABandRestImports: [...typeof import('./code').array, 4,   5,6 ],

withMultilineString:                            `                       This\\;
string,
has\\;
      a lot of\\;
commas,
  and\\;
newlines`
    }
  >
) {}

describe('this options variations', () => {
  const test = KitaTestBuilder.build(__filename, exports);

 it('works', async () => {
    const { KitaAST } = await test;
    const getRoute = KitaAST.routes[0]!;

    expect(getRoute).toBeDefined();
    expect(getRoute.schema.operationId).toBe('getname');

    let code;
    eval(`code = { ${getRoute.options?.replace(/\.\/parameters\/this/g, '.')} }`);

    expect(code).toStrictEqual({
      bodyLimit: 1,
      config: { withNewline: true, withTrailingComma: true },
      withoutTrailingComma: {},
      withDefaultImport: require('./code'),
      withAImport: require('./code').a,
      withABimports: [require('./code').a, require('./code').b],
      withABimportsAndComma: [require('./code').a, require('./code').b],
      withABandRestImports: [...require('./code').array, 4, 5, 6],
      withMultilineString: `                       This;
string,
has;
      a lot of;
commas,
  and;
newlines`
    });
  });
});
