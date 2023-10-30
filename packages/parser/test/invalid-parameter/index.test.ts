import { ParameterResolverNotFoundError, RouteParameterMultipleErrors, parseConfig } from '@kitajs/common';
import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import { KitaParser } from '../../src';

describe('Hello World', async () => {
  const kita = KitaParser.create(
    parseConfig({
      tsconfig: require.resolve('../../tsconfig.json'),
      cwd: __dirname,
      providerFolder: 'providers',
      routeFolder: 'routes',
      runtimePath: path.resolve(__dirname, 'runtime')
    })
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

      // I know this isn't the best way,
      // but it works for now (windows adds \\ (2 chars) instead of / (1 char)
      assert.equal(first.diagnostic.start, process.platform === 'win32' ? 96 : 93);

      assert.equal(first.diagnostic.length, 'ASD'.length);
      assert.equal(first.diagnostic.file?.fileName, path.resolve(__dirname, 'providers/index.ts')); // full path
    } else {
      assert.fail('Expected ParameterResolverNotFoundError');
    }

    const second = errors[1];
    if (second instanceof RouteParameterMultipleErrors) {
      // export function get(_: ASD, __: Provider) {
      //                     ~~~
      assert.equal(second.diagnostic.relatedInformation?.[0]?.start, process.platform === 'win32' ? 95 : 92);
      assert.equal(second.diagnostic.relatedInformation?.[0]?.length, 'ASD'.length);
      assert.equal(
        second.diagnostic.relatedInformation?.[0]?.file?.fileName,
        // needs full path
        path.resolve(__dirname, 'routes/index.ts')
      );

      // export default function (_: ASD): Provider {
      //                             ~~~
      assert.equal(second.diagnostic.relatedInformation?.[1]?.start, process.platform === 'win32' ? 104 : 101);
      assert.equal(second.diagnostic.relatedInformation?.[1]?.length, 'Provider'.length);

      assert.equal(
        second.diagnostic.relatedInformation?.[1]?.file?.fileName,
        // needs full path
        path.resolve(__dirname, 'routes/index.ts')
      );

      // only 2 errors
      assert.equal(second.diagnostic.relatedInformation?.length, 2);
    } else {
      assert.fail('Expected ParameterResolverNotFoundError');
    }

    assert.equal(errors.length, 2);
  });
});
