import path from 'path';

/** Remove extension from import path */
export function formatImport(imp: string, cwd: string) {
  imp = imp.replace(/\.[^/\\.]+$/, '');

  // Makes sure the relative import is absolute
  if (imp.startsWith('./')) {
    imp = path.resolve(cwd, imp);
  }

  return path.posix.normalize(imp);
}
