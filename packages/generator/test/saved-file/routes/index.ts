import type { SavedFile } from '@kitajs/runtime';
import assert from 'assert';
import { readFileSync } from 'fs';

export function post(file: SavedFile, unnamed: SavedFile<'named'>) {
  assert.ok(file);
  assert.ok(unnamed);

  assert.equal(readFileSync(file.filepath, 'utf-8'), 'File 3');
  assert.equal(readFileSync(unnamed.filepath, 'utf-8'), 'File 4');

  return true;
}
