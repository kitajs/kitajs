import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Schemas Provider', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('KitaSchemas was generated', () => {
    assert.deepStrictEqual(runtime.KitaSchemas, {
      B: {
        additionalProperties: false,
        properties: {
          a: {
            const: 1,
            type: 'number'
          }
        },
        required: ['a'],
        type: 'object'
      },
      C: {
        additionalProperties: false,
        properties: {
          g: {
            const: 2,
            minLength: 1,
            type: 'number'
          }
        },
        required: ['g'],
        type: 'object'
      },
      Sample: {
        additionalProperties: false,
        properties: {
          a: {
            const: 1,
            type: 'number'
          },
          g: {
            const: 2,
            minLength: 1,
            type: 'number'
          },
          h: {
            const: 2,
            minLength: 2,
            type: 'number'
          }
        },
        required: ['a', 'g', 'h'],
        type: 'object'
      }
    });
  });
});
