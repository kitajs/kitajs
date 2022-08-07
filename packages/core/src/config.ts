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
     * @default '@kita/generator/templates/default.hbs'
     */
    template: string;
  };

  controllers: {
    /**
     * The regex to match all files to parse
     *
     * @default ['src/routes/⁎⁎/⁎.ts','routes/⁎⁎/⁎.ts']
     */
    glob: string[];

    /**
     * The regex to remove from the file path to get the controller name
     *
     * @default ^(?:src)?\/?(routes\/?)
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

// TODO: Optimize this and extract defaults to a constant
export function mergeDefaults(config?: Partial<KitaConfig>): KitaConfig {
  return {
    tsconfig: config?.tsconfig ?? './tsconfig.json',

    params: config?.params ?? {},

    controllers: {
      glob: config?.controllers?.glob ?? ['src/routes/**/*.ts', 'routes/**/*.ts'],
      prefix: config?.controllers?.prefix ?? '(?:src)?/?(routes/?)'
    },

    routes: {
      output: config?.routes?.output ?? './src/routes.ts',
      template: config?.routes?.template ?? '@kita/generator/templates/default.hbs'
    }
  };
}
