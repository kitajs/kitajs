import path from 'node:path';

export const KITA_BIN = path.resolve(
  __dirname,
  '..',
  'bin',
  // win32 uses a .cmd file
  process.platform === 'win32' ? 'dev.cmd' : 'dev'
);
