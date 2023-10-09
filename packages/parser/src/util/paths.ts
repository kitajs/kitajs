import fs from 'fs';
import path from 'path';

export function walk(dir: string) {
  try {
    return (
      fs
        .readdirSync(dir, { recursive: true, encoding: 'utf-8' })
        .map((f) => path.join(dir, f))
        // TODO: This may be slow, we should probably use a faster method
        .filter((f) => fs.statSync(f).isFile())
    );
  } catch (e: any) {
    // Ignore if folder does not exist
    if (e.code === 'ENOENT') {
      return [];
    }

    throw e;
  }
}
