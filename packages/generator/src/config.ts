import deepmerge from 'deepmerge';
import type * as Prettier from 'prettier';
import type { SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import { KitaError } from './errors';
import type { KitaGenerator } from './generator';
import type { DeepPartial } from './types';

/**
 * The kita config interface. all possible customizations are done through this interface.
 */
export interface KitaConfig {
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
     * If the generated code should be formatted with prettier
     *
     * @default { parser: 'typescript' }
     */
    format: false | Prettier.Options | Record<string, unknown>;

    /**
     * If the generated code should include the whole ast as a KitaAST object
     *
     * @default false
     */
    exportAST: boolean;

    /**
     * If the generated code should include the resolved config object as a
     * ResolvedConfig object
     *
     * @default false
     */
    exportConfig: boolean;

    /**
     * If the generated code should include a object with all the controllers
     * as properties, useful for calling them manually.
     *
     * @default false
     */
    exportControllers: boolean;
  };

  schema: {
    /**
     * General response types to append on all routes schemas.
     *
     * @see https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/#serialization
     *
     * @default {}
     */
    responses: {
      [key: string | number]: any;
    };

    /**
     * The default response status to use for generated response types.
     *
     * @default 'default'
     */
    defaultResponse: string;

    /**
     * The config to the ts-json-schema-generator that is used to generate schemas from typescript AST.
     *
     * @default { encodeRefs: true, sortProps: true, strictTuples: true, jsDoc: 'extended' }
     */
    generator: import('ts-json-schema-generator').Config & {
      /** Extra parsers to handle ts.Nodes into Schema Nodes */
      parsers: SubNodeParser[];
      /** Extra formatters to handle Schema Nodes into json schemas */
      formatters: SubTypeFormatter[];
    };
  };

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

  /**
   * The parameter name and its path
   *
   * @default {}
   */
  params: Record<
    string,
    | string
    | [
        import: string,
        config: {
          /**
           * Enable this to use the schema transformer. It is a exported function called `schemaTransformer` that
           *  receives and returns a json schema object and
           */
          schemaTransformer?: boolean;
        }
      ]
  >;

  // Want more listeners? Create a PR!
  // :)

  /**
   * Customize directly the kita generator, when it is created.
   *
   * Here you can add custom routes or custom parameters.
   *
   * @example
   *
   * ```ts
   * module.exports = {
   *   onCreate({ routes }) {
   *    routes.push(new CustomRouterThatIWrote());
   *   }
   * }
   * ```
   */
  onCreate?: (kg: KitaGenerator) => void;

  /**
   * Called when the generator finished building / updating its routes AST.
   *
   * You can use this to modify the AST before it gets emitted.
   *
   * @example
   *
   * ```ts
   * module.exports = {
   *   onAstUpdate({ ast }) {
   *    ast.addImport(`import './custom-code`);
   *   }
   * }
   * ```
   */
  onAstUpdate?: (kg: KitaGenerator) => void | Promise<void>;

  /**
   * Returns a custom generator, instead of the default {@link KitaGenerator}.
   *
   * @example
   *
   * ```ts
   * const { KitaGenerator } = require('@kitajs/generator');
   *
   * module.exports = {
   *   customGenerator: class CustomGenerator extends KitaGenerator {
   *      // ... custom code
   *    }
   *  }
   * ```
   */
  customGenerator?: typeof KitaGenerator;
}

export const DefaultConfig: KitaConfig = {
  params: {},
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: {
    output: './src/routes.ts',
    format: { parser: 'typescript' },
    exportAST: false,
    exportConfig: false,
    exportControllers: false
  },
  schema: {
    defaultResponse: 'default',
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

export function mergeDefaults(config: DeepPartial<KitaConfig> = {}) {
  if (config?.controllers?.glob) {
    if (!Array.isArray(config.controllers.glob)) {
      throw KitaError('controllers.glob must be an array of strings', {
        controllers: config.controllers
      });
    }
  }

  // Removes additionalProperties property from schemas if this is the default value
  if (
    config.schema?.generator &&
    config.schema.generator.additionalProperties !== false
  ) {
    config.schema.generator.additionalProperties = undefined;
  }

  return deepmerge<KitaConfig>(
    DefaultConfig,
    // validated config
    config as KitaConfig,
    { arrayMerge: (_, b) => b }
  );
}

export function importConfig(path: string) {
  try {
    return mergeDefaults(require(path));
  } catch (e: any) {
    // The provided path is not a valid config file
    if (
      e.code === 'MODULE_NOT_FOUND' &&
      e.message.includes(`Cannot find module '${path}'`)
    ) {
      return DefaultConfig;
    }

    throw KitaError('Could not import config file\n' + e.message);
  }
}
