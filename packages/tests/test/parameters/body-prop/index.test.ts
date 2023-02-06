import type { BodyProp } from '@kitajs/runtime';
import { KitaTestBuilder } from '../../builder';

export function post(
  body: BodyProp<{ name: string; age: number }>,
  named?: BodyProp<string, 'name'>
) {
  return `Hello ${body.name || named}!`;
}

describe('body prop tests', () => {
  const test = KitaTestBuilder.build(__filename, exports);

  it('should work', async () => {
    const { KitaAST } = await test;

    expect(KitaAST.routes).toHaveLength(1);

    const post = KitaAST.routes[0]!;
    const body = KitaAST.schemas[0]!;

    expect(body).toMatchObject({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' }
      },
      required: ['name', 'age'],
      additionalProperties: false
    });

    expect(post.schema.body).toStrictEqual({
      type: 'object',
      properties: {
        body: { $ref: body.$id },
        name: { type: 'string' }
      },
      required: ['body'],
      additionalProperties: false
    });
  });
});
