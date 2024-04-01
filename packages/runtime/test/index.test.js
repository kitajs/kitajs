const { test, describe } = require('node:test');
const assert = require('node:assert');

const runtime = require('../index.js');

describe('Runtime tests', () => {
  test('Only exports Kita function by default', () => {
    assert.equal(typeof runtime, 'object');
    assert.deepEqual(Object.keys(runtime), ['Kita']);
  });

  test('Default Kita function throws error', () => {
    try {
      runtime.Kita();
      assert.fail('Kita function should throw error');
    } catch (error) {
      console.log(error);
      assert.equal(error.message, 'You must run `kita build` before using @kitajs/runtime.');
    }
  });
});
