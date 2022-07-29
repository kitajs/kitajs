import { cosmiconfig } from 'cosmiconfig';

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

export function mergeDefaults(config: Partial<KitaConfig>): KitaConfig {
  return {
    tsconfig: config?.tsconfig ?? './tsconfig.json',

    params: config?.params ?? {},

    controllers: {
      glob: config?.controllers?.glob ?? ['src/api/**/*.ts', 'api/**/*.ts']
    },

    routes: {
      output: config?.routes?.output ?? './src/routes.ts',
      template: config?.routes?.template ?? '@kita/core/templates/default.hbs'
    }
  };
}
