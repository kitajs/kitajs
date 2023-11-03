import { kKitaGlobalRoot } from '@kitajs/common';
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

/* Returns an already quoted import-ready string */
export function toMaybeRelativeImport(imp: string, cwd: string, src: string) {
  imp = removeExt(imp);

  const relative = isRelative(imp);

  if (!relative) {
    return `'${escapePath(imp)}'`;
  }

  // Removes source folder from path, as it will be contained in the `KITA_GLOBAL_ROOT` variable
  return `\`\${${kKitaGlobalRoot}}${path.sep}${escapePath(path.relative(path.relative(cwd, src), imp))}\``;
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

/** Matches all \ in a string */
const DOUBLE_BACKSLASH = /\\/g;
const DOLLAR_SIGN = /\$/g;
const SINGLE_QUOTE = /'/g;
const DOUBLE_QUOTE = /"/g;

/** Escape string for use inside path strings. */
export function escapePath(p: string) {
  return p
    .replace(DOUBLE_BACKSLASH, '\\\\')
    .replace(DOLLAR_SIGN, '\\$')
    .replace(SINGLE_QUOTE, "\\'")
    .replace(DOUBLE_QUOTE, '\\"');
}
