import assert from 'node:assert';
import test, { describe } from 'node:test';
import type { JsonSchema } from '@kitajs/common';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Schema Refs generation', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes was generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
    assert.equal(kita.getSchemaCount(), 3);
  });

  test('inline schemas were generated successfully', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [{ name: 'BodyParameterParser', value: 'req.body' }],
      schema: {
        operationId: 'postIndex',
        response: { '2xx': { $ref: 'PostIndexResponse' } },
        body: {
          type: 'object',
          properties: {
            a: { type: 'number' },
            b: { type: 'array', items: { $ref: 'Exported' } },
            c: { $ref: 'Exported' },
            d: {
              type: 'object',
              properties: { c: { type: 'number' } },
              required: ['c'],
              additionalProperties: false
            },
            e: {
              type: 'array',
              items: {
                type: 'object',
                properties: { c: { type: 'number' } },
                required: ['c'],
                additionalProperties: false
              }
            },
            f: {
              type: 'object',
              properties: {
                a: { type: 'number' },
                b: { type: 'array', items: { $ref: 'Exported' } },
                c: { $ref: 'Exported' },
                d: {
                  type: 'object',
                  properties: { c: { type: 'number' } },
                  required: ['c'],
                  additionalProperties: false
                },
                e: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: { c: { type: 'number' } },
                    required: ['c'],
                    additionalProperties: false
                  }
                }
              },
              required: ['a', 'b', 'c', 'd', 'e'],
              additionalProperties: false
            },
            g: {
              type: 'object',
              properties: {
                a: { type: 'number' },
                b: { type: 'array', items: { $ref: 'Exported' } },
                c: { $ref: 'Exported' },
                d: {
                  type: 'object',
                  properties: { c: { type: 'number' } },
                  required: ['c'],
                  additionalProperties: false
                },
                e: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: { c: { type: 'number' } },
                    required: ['c'],
                    additionalProperties: false
                  }
                }
              },
              required: ['a', 'b', 'c', 'd', 'e'],
              additionalProperties: false
            },
            h: { $ref: 'H' }
          },
          required: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
          additionalProperties: false
        }
      }
    });
  });

  test('only Exported and H were separated into different schemas', () => {
    const exported = kita.getSchema('Exported');

    assert.deepStrictEqual(exported, {
      $id: 'Exported',
      type: 'object',
      properties: { b: { type: 'number' } },
      required: ['b'],
      additionalProperties: false
    });

    const schema = kita.getSchema('H');

    assert.deepStrictEqual(schema, {
      $id: 'H',
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'array', items: { $ref: 'Exported' } },
        c: { $ref: 'Exported' },
        d: {
          type: 'object',
          properties: { c: { type: 'number' } },
          required: ['c'],
          additionalProperties: false
        },
        e: {
          type: 'array',
          items: {
            type: 'object',
            properties: { c: { type: 'number' } },
            required: ['c'],
            additionalProperties: false
          }
        }
      },
      required: ['a', 'b', 'c', 'd', 'e'],
      additionalProperties: false
    });
  });

  test('PostIndexResponse was also generated', () => {
    const response = kita.getSchema('PostIndexResponse');

    assert.deepStrictEqual(response, {
      $id: 'PostIndexResponse',
      type: 'object',
      properties: {
        a: { type: 'number' },
        b: { type: 'array', items: { $ref: 'Exported' } },
        c: { $ref: 'Exported' },
        d: {
          type: 'object',
          properties: { c: { type: 'number' } },
          required: ['c'],
          additionalProperties: false
        },
        e: {
          type: 'array',
          items: {
            type: 'object',
            properties: { c: { type: 'number' } },
            required: ['c'],
            additionalProperties: false
          }
        },
        f: {
          type: 'object',
          properties: {
            a: { type: 'number' },
            b: { type: 'array', items: { $ref: 'Exported' } },
            c: { $ref: 'Exported' },
            d: {
              type: 'object',
              properties: { c: { type: 'number' } },
              required: ['c'],
              additionalProperties: false
            },
            e: {
              type: 'array',
              items: {
                type: 'object',
                properties: { c: { type: 'number' } },
                required: ['c'],
                additionalProperties: false
              }
            }
          },
          required: ['a', 'b', 'c', 'd', 'e'],
          additionalProperties: false
        },
        g: {
          type: 'object',
          properties: {
            a: { type: 'number' },
            b: { type: 'array', items: { $ref: 'Exported' } },
            c: { $ref: 'Exported' },
            d: {
              type: 'object',
              properties: { c: { type: 'number' } },
              required: ['c'],
              additionalProperties: false
            },
            e: {
              type: 'array',
              items: {
                type: 'object',
                properties: { c: { type: 'number' } },
                required: ['c'],
                additionalProperties: false
              }
            }
          },
          required: ['a', 'b', 'c', 'd', 'e'],
          additionalProperties: false
        },
        h: { $ref: 'H' }
      },
      required: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      additionalProperties: false
    });

    // the same object as the body
    const body = kita.getRoute('postIndex')?.schema.body;

    // $id is defined only for external schemas
    const responseWithoutId = Object.assign<Partial<JsonSchema>, unknown>({}, response);
    responseWithoutId.$id = undefined;

    assert.deepStrictEqual(body, responseWithoutId);
  });
});
