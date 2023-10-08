import type { KitaConfig } from './model';

export const DefaultConfig: KitaConfig = {
  cwd: process.cwd(),
  controllers: {
    glob: ['src/routes/**/*.ts', 'src/routes/**/*.tsx'],
    prefix: /^(.+?\/routes\/)/
  },
  providers: {
    glob: ['src/providers/**/*.ts']
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
