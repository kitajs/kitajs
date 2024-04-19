import { DefaultExportedRoute } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutesWithErrors } from '../runner';

describe('Default export', () => {
  test('does not allows default export routes', async () => {
    const { errors } = parseRoutesWithErrors(__dirname);

    assert.equal(errors.length, 1);
    assert.ok(errors[0] instanceof DefaultExportedRoute);
    // diagnostic.start is the position of the default keyword
    assert.equal(
      errors[0]!.diagnostic.file
        ?.getText()
        .slice(errors[0]!.diagnostic.start!, errors[0]!.diagnostic.start! + errors[0]!.diagnostic.length!),
      'default'
    );
  });
});
