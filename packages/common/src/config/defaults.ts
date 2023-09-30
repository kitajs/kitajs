import type { KitaConfig } from './model';

export const DefaultConfig: KitaConfig = {
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: /^(.+?\/routes\/)/
  },
  providers: {
    glob: ['src/providers/**/*.ts', 'providers/**/*.ts']
  },
  routes: {
    output: './src/routes.ts',
    format: { parser: 'typescript' }
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
