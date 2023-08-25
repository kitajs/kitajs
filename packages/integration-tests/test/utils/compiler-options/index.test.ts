import { readCompilerOptions } from '@kitajs/generator';
import path from 'path';

const TSCONFIG1 = path.resolve(__dirname, 'tsconfig1.json');
const TSCONFIG2 = path.resolve(__dirname, 'tsconfig2.json');

describe('tests tsconfig read', () => {
  it.concurrent('expects read normal file', async () => {
    expect(readCompilerOptions(TSCONFIG1)).toStrictEqual({
      experimentalDecorators: true,
      configFilePath: TSCONFIG1
    });
  });

  it.concurrent('expects tsconfig extends works', async () => {
    expect(readCompilerOptions(TSCONFIG2)).toStrictEqual({
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      configFilePath: TSCONFIG2
    });
  });
});
