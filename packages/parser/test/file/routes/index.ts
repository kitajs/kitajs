import type { File, SavedFile } from '@kitajs/runtime';

export function post(file: File, unnamed: File<'named'>) {
  return {
    file: file.type,
    unnamed: unnamed.type
  };
}

export function put(file: SavedFile, unnamed: SavedFile<'named'>) {
  return {
    file: file.type,
    unnamed: unnamed.type
  };
}
