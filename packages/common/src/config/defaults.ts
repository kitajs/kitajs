import type { KitaConfig } from './model';

export const DefaultConfig: KitaConfig = {
  tsconfig: './tsconfig.json',
  cwd: process.cwd(),
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: /^(.+?\/routes\/)/
  },
  providers: {
    glob: ['src/providers/**/*.ts', 'providers/**/*.ts']
  },
  schema: {
    responses: {},
    generator: {
      encodeRefs: true,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended',
      parsers: [],
      formatters: []
    }
  }
};
