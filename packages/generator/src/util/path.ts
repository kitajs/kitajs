import path from 'path';

/** Posix: `./`, in windows: `.\\` */
export const CURRENT_DIR = path.join('./');

/** Remove extension from import path */
export function formatImport(imp: string, cwd: string) {
  const withoutExtension = removeExt(imp);

  // Makes sure the relative import is absolute
  if (withoutExtension.startsWith(CURRENT_DIR)) {
    imp = path.resolve(cwd, imp);
    console.log({ imp });
    return imp;
  }

  // Just normalizes it
  imp = path.normalize(imp);
  console.log({ imp });
  return imp;
}

/** Removes the extension from a path, if present. */
export function removeExt(p: string) {
  const ext = path.extname(p);

  // Only remove the extension if its present
  if (ext) {
    return p.slice(0, -ext.length);
  } else {
    return p;
  }
}
