import path from 'path';

export const esmImport = (
  i: { name: string; path: string },
  cwd?: string,
  gwd?: string,
  outDir?: string,
  src?: string
) => {
  let resolved = i.path;

  if (cwd) {
    resolved = path.resolve(cwd, resolved);
  }

  if (gwd) {
    resolved = path.relative(gwd, resolved);
  }

  if (outDir && src) {
    resolved = resolved.replace(src, outDir);
  }

  // removes .ts or .tsx
  resolved = resolved.replace(/\.tsx?$/, '');

  return /*ts*/ `import ${i.name} from '${resolved}';`;
};
