import path from 'path';

export const esmImport = (i: { name: string; path: string }, cwd?: string) =>
  /* ts */ `

import ${i.name} from '${i.path[0] === '.' && cwd ? path.relative(cwd, i.path) : i.path}';

`.trim();
