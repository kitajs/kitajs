import path from 'path';

export const esmImport = (i: { name: string; path: string }, cwd?: string) => {
  let p = i.path[0] === '.' && cwd ? path.relative(cwd, i.path) : i.path;

  p = p.replace(/\.tsx?$/, '');

  return /*ts*/ `import ${i.name} from '${p}';`;
};
