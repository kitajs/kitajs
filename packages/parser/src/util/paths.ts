import fs from 'fs';
import path from 'path';

/** Synchronously walks the given directory and returns all files in it. */
export function walk(dir: string): string[] {
  try {
    return (
      fs
        .readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter((f) => f.isFile())
        // Node <20 f.path may be undefined
        .map((f) => path.resolve(f.path || dir, f.name))
    );
  } catch (e: any) {
    // Ignore if folder does not exist
    if (e.code === 'ENOENT') {
      return [];
    }

    throw e;
  }
}

/**
 * Makes the given path relative to the current working directory (`./`).
 *
 * Posix: `./<dir>`, in windows: `.\\<dir>`
 */
export function cwdRelative(p: string) {
  return path.join('./') + path.normalize(p);
}
