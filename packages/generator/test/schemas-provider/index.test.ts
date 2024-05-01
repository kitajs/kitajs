import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type * as Runtime from './runtime.kita';
describe('Schemas Provider', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('KitaSchemas was generated', () => {
    assert.deepStrictEqual(rt.KitaSchemas, {
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
