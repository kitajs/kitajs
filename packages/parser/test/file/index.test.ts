import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('File and SavedFile', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
    assert.equal(kita.getPluginCount(), 3);
  });

  test('created fastifyMultipart plugin', () => {
    assert.ok(kita.getPlugin('fastifyMultipart'));
  });

  test('works with File', async () => {
    const route = await kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [
        { name: 'FileParameterParser', value: 'req.body.file' },
        { name: 'FileParameterParser', value: 'req.body.named' }
      ],
      schema: {
        operationId: 'postIndex',
        response: { '2xx': { $ref: 'PostIndexResponse' } },
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          properties: { file: { isFile: true }, named: { isFile: true } },
          required: ['file', 'named'],
          additionalProperties: undefined
        }
      }
    });
  });

  test('works with SavedFile', async () => {
    const route = await kita.getRoute('putIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'put',
      method: 'PUT',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [
        {
          name: 'FileParameterParser',
          value: "req.savedRequestFiles.find(file => file.fieldname === 'file')",
          helper: 'await req.saveRequestFiles()'
        },
        {
          name: 'FileParameterParser',
          value: "req.savedRequestFiles.find(file => file.fieldname === 'named')",
          helper: undefined
        }
      ],
      schema: {
        operationId: 'putIndex',
        response: { '2xx': { $ref: 'PutIndexResponse' } },
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          properties: { file: { isFile: true }, named: { isFile: true } },
          required: ['file', 'named'],
          additionalProperties: undefined
        }
      }
    });
  });
});
