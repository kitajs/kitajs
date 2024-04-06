import type { File } from '@kitajs/runtime';
import assert from 'node:assert';

export async function post(file: File, unnamed: File<'named'>) {
  assert.ok(file);
  assert.ok(unnamed);

  assert.equal((await file.toBuffer()).toString('utf-8'), 'File 1');
  assert.equal((await unnamed.toBuffer()).toString('utf-8'), 'File 2');

  return true;
}
