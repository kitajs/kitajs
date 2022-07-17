import { cosmiconfig } from 'cosmiconfig';

export type KitaConfig = {
  routes: {
    output: string;
    /**
     * The template path that the route will be rendered to.
     *
     * @default '@kita/core/templates/default.hbs'
     */
    template: string;
  };

  controllers: {
    /**
     * The regex to match all files to parse
     *
     * @default ['src/api/⁎⁎/⁎.ts','api/⁎⁎/⁎.ts']
     */
    glob: string[];
  };

  /**
   * The tsconfig path
   *
   * @default './tsconfig.json'
   */
  tsconfig: string;
};

export function createConfigExplorer() {
  return cosmiconfig('kita', { packageProp: 'kita' }).search();
}

export function mergeDefaults(config: any): KitaConfig {
  return {
    tsconfig: config?.tsconfig ?? './tsconfig.json',

    controllers: {
      glob: config?.controllers?.glob ?? ['src/api/**/*.ts', 'api/**/*.ts']
    },

    routes: {
      output: config?.routes?.output ?? './src/routes.ts',
      template: config?.routes?.template ?? '@kita/core/templates/default.hbs'
    }
  };
}

