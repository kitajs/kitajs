import { RouteWithoutReturnError } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutesWithErrors } from '../runner';

describe('Void return type', () => {
  test('does not allows routes returning null', async () => {
    const { errors } = await parseRoutesWithErrors(__dirname);

    assert.equal(errors.length, 3);
    assert.ok(errors[0] instanceof RouteWithoutReturnError);
    assert.ok(errors[1] instanceof RouteWithoutReturnError);
    assert.ok(errors[2] instanceof RouteWithoutReturnError);
    assert.ok(errors[0].diagnostic.start !== errors[1]?.diagnostic.start);
    assert.ok(errors[1].diagnostic.start !== errors[2]?.diagnostic.start);
  });
});
