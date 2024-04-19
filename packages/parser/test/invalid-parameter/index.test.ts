import { RouteParameterMultipleErrors, parseConfig, readCompilerOptions } from '@kitajs/common';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test, { describe } from 'node:test';
import { KitaParser, walk } from '../../src';

const ROUTE_SOURCE = readFileSync(path.resolve(__dirname, 'routes/index.ts'), 'utf-8');
const PROVIDER_SOURCE = readFileSync(path.resolve(__dirname, 'providers/index.ts'), 'utf-8');
const tsconfig = require.resolve('../../tsconfig.json');

describe('Hello World', async () => {
  const kita = KitaParser.create(
    parseConfig({
      tsconfig,
      cwd: __dirname,
      src: __dirname,
      runtimePath: path.resolve(__dirname, 'runtime')
    }),
    readCompilerOptions(tsconfig),
    walk(__dirname)
  );

  test('expect 2 errors', async () => {
    const errors = [];

    for (const error of kita.parse()) {
      errors.push(error);
    }

    assert.equal(errors.length, 1);

    if (!errors[0] || !(errors[0] instanceof RouteParameterMultipleErrors)) {
      assert.fail('Expected RouteParameterMultipleErrors');
    }

    // export function get(_: ASD, __: Provider) {
    //                        ~~~

    assert.equal(errors[0].diagnostic.relatedInformation?.[0]?.start, ROUTE_SOURCE.indexOf('_: ASD') + '_: '.length);
    assert.equal(errors[0].diagnostic.relatedInformation?.[0]?.length, 'ASD'.length);
    assert.equal(
      errors[0].diagnostic.relatedInformation?.[0]?.file?.fileName,
      // needs full posix paths
      path.posix.join(__dirname.replaceAll(path.sep, '/'), 'routes', 'index.ts')
    );

    // export default function (_: ASD): Provider {
    //                             ~~~
    assert.equal(errors[0].diagnostic.relatedInformation?.[1]?.start, PROVIDER_SOURCE.indexOf('_: ASD') + '_: '.length);
    assert.equal(errors[0].diagnostic.relatedInformation?.[1]?.length, 'ASD'.length);
    assert.equal(
      errors[0].diagnostic.relatedInformation?.[1]?.file?.fileName,
      path.posix.join(__dirname.replaceAll(path.sep, '/'), 'providers', 'index.ts')
    ); // full path

    // only 2 errors
    assert.equal(errors[0].diagnostic.relatedInformation?.length, 2);
  });
});
