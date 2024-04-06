import type { SavedFile } from '@kitajs/runtime';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

export function post(file: SavedFile, unnamed: SavedFile<'named'>) {
  assert.ok(file);
  assert.ok(unnamed);

  assert.equal(readFileSync(file.filepath, 'utf-8'), 'File 3');
  assert.equal(readFileSync(unnamed.filepath, 'utf-8'), 'File 4');

  return true;
}
