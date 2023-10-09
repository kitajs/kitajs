import fs from 'fs';
import path from 'path';

/** Synchronously walks the given directory and returns all files in it. */
export function walk(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { recursive: true, withFileTypes: true })
      .flatMap((f) => (f.isDirectory() ? walk(path.join(dir, f.name)) : path.join(dir, f.name)));
  } catch (e: any) {
    // Ignore if folder does not exist
    if (e.code === 'ENOENT') {
      return [];
    }

    throw e;
  }
}
