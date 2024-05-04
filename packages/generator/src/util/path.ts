import path from 'node:path';

/** Posix: `./`, in windows: `.\\` */
const CURRENT_DIR = `.${path.sep}`;
const PREVIOUS_DIR = `..${path.sep}`;

export function formatImport(from: string, esm: boolean, src?: string) {
  const relative = getRelativeness(from) ? `./${path.relative(src!, from)}` : from;
  const toUnix = relative.replace(/\\/g, '/');
  const withoutExt = removeExt(toUnix);
  const withJs = esm ? `${withoutExt}.js` : withoutExt;
  return withJs;
}

/** Removes the extension from a path, if present. */
function removeExt(p: string) {
  const ext = path.extname(p);
  // Only remove the extension if its present
  return ext ? p.slice(0, -ext.length) : p;
}

function getRelativeness(p: string) {
  if (p.startsWith(CURRENT_DIR)) {
    return CURRENT_DIR;
  }

  if (p.startsWith(PREVIOUS_DIR)) {
    return PREVIOUS_DIR;
  }

  return false;
}
