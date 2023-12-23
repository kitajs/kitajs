import { DefaultExportedRoute } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Default export', () => {
  test('does not allows default export routes', async () => {
    try {
      await parseRoutes(__dirname);
      assert.fail('Should not allow default export routes');
    } catch (error) {
      assert.ok(error instanceof DefaultExportedRoute);

      // diagnostic.start is the position of the default keyword
      assert.equal(
        error.diagnostic.file
          ?.getText()
          .slice(error.diagnostic.start!, error.diagnostic.start! + error.diagnostic.length!),
        'export'
      );
    }
  });
});
