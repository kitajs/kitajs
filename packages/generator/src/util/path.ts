import path from 'path';

/** Posix: `./`, in windows: `.\\` */
export const CURRENT_DIR = `.${path.sep}`;
export const PREVIOUS_DIR = `..${path.sep}`;

export function isRelative(p: string) {
  if (p.startsWith(CURRENT_DIR)) {
    return CURRENT_DIR;
  }

  if (p.startsWith(PREVIOUS_DIR)) {
    return PREVIOUS_DIR;
  }

  return false;
}

/** Matches all \ in a string */
const DOUBLE_BACKSLASH = /\\/g;

/** Remove extension from import path */
export function formatImport(imp: string, cwd: string) {
  imp = removeExt(imp);

  // Makes sure the relative import is absolute
  if (isRelative(imp)) {
    imp = path.resolve(cwd, imp);
  }

  return escapePath(imp);
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

/**
 * Double escape windows paths
 *
 * - Value: `\a`
 * - String: `\\a`
 * - String of source code: `\\\\a`
 */
export function escapePath(p: string) {
  return p.replace(DOUBLE_BACKSLASH, '\\\\');
}
