import {
  ParameterResolverNotFoundError,
  RouteParameterMultipleErrors,
  parseConfig,
  readCompilerOptions
} from '@kitajs/common';
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

    for await (const error of kita.parse()) {
      errors.push(error);
    }

    const first = errors[0];
    if (first instanceof ParameterResolverNotFoundError) {
      // export default function (_: ASD): Provider {
      //                             ~~~
      assert.equal(first.diagnostic.start, PROVIDER_SOURCE.indexOf('_: ASD') + '_: '.length);
      assert.equal(first.diagnostic.length, 'ASD'.length);
      assert.equal(
        first.diagnostic.file?.fileName,
        path.posix.join(__dirname.replaceAll(path.sep, '/'), 'providers', 'index.ts')
      ); // full path
    } else {
      assert.fail('Expected ParameterResolverNotFoundError');
    }

    const second = errors[1];
    if (second instanceof RouteParameterMultipleErrors) {
      // export function get(_: ASD, __: Provider) {
      //                        ~~~      ~~~~~~~~
      assert.equal(second.diagnostic.relatedInformation?.[0]?.start, ROUTE_SOURCE.indexOf('_: ASD') + '_: '.length);
      assert.equal(second.diagnostic.relatedInformation?.[0]?.length, 'ASD'.length);
      assert.equal(
        second.diagnostic.relatedInformation?.[0]?.file?.fileName,
        // needs full posix paths
        path.posix.join(__dirname.replaceAll(path.sep, '/'), 'routes', 'index.ts')
      );
      assert.equal(
        second.diagnostic.relatedInformation?.[1]?.start,
        ROUTE_SOURCE.indexOf('__: Provider') + '__: '.length
      );
      assert.equal(second.diagnostic.relatedInformation?.[1]?.length, 'Provider'.length);

      assert.equal(
        second.diagnostic.relatedInformation?.[1]?.file?.fileName,
        // needs full path
        path.posix.join(__dirname.replaceAll(path.sep, '/'), 'routes', 'index.ts')
      );

      // only 2 errors
      assert.equal(second.diagnostic.relatedInformation?.length, 2);
    } else {
      assert.fail('Expected ParameterResolverNotFoundError');
    }

    assert.equal(errors.length, 2);
  });
});
