import { cosmiconfig } from 'cosmiconfig';
import deepmerge from 'deepmerge';

export type KitaConfig = {
  /**
   * The tsconfig path
   *
   * @default './tsconfig.json'
   */
  tsconfig: string;

  routes: {
    /**
     * Where to emit the generated routes file
     *
     * @default './src/routes.ts'
     */
    output: string;
  };

  /**
   * The base import for all templates to be resolved.
   *
   * @default '@kita/generator/templates'
   */
  templates: string;

  controllers: {
    /**
     * The regex to match all files to parse
     *
     * @default ['src/routes/⁎⁎/⁎.ts','routes/⁎⁎/⁎.ts']
     */
    glob: string[];

    /**
     * The regex to extract the route controller pathname from the absolute path
     *
     * @default /(?:.*src)?\/?(?:routes\/?)/
     */
    prefix: string;
  };

  params: {
    /**
     * The parameter name and its path
     *
     * @default {}
     */
    [name: string]: string;
  };
};

export function createConfigExplorer() {
  return cosmiconfig('kita', { packageProp: 'kita' }).search();
}

export const ConfigDefaults: KitaConfig = {
  params: {},
  tsconfig: './tsconfig.json',
  templates: '@kitajs/generator/templates',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?\/?(?:routes\/?)'
  },
  routes: {
    output: './src/routes.ts'
  }
} ;

export function mergeDefaults(config?: Partial<KitaConfig>): KitaConfig {
  return deepmerge(ConfigDefaults, config || {});
}
