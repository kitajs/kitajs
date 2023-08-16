import deepmerge from 'deepmerge';
import type * as Prettier from 'prettier';
import type { SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import { KitaError } from './errors';
import type { DeepPartial } from './types';
import type { Kita } from './v2/kita';
import type { ParameterParser, RouteParser } from './v2/parsers';

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


  providers: {
    /**
     * The regex to match all files to parse
     *
     * @default ['src/providers/⁎⁎/⁎.ts','providers/⁎⁎/⁎.ts']
     */
    glob: string[];
  };

  /**
   * Here you can add custom code to be executed before the generator starts. Add listeners,
   * modify the config, etc.
   */
  hook?: (kita: Kita) => void | Promise<void>;

  /**
   * Use this callback to include new parameter parsers.
   */
  parameterParserAugmentor?: (parser: ParameterParser) => void | Promise<void>;

  /**
   * Use this callback to include new route parsers.
   */
  routeParserAugmentor?: (parser: RouteParser) => void | Promise<void>;
}

export const DefaultConfig: KitaConfig = {
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  providers: {
    glob: ['src/providers/**/*.ts', 'providers/**/*.ts']
  },
  routes: {
    output: './src/routes.ts',
    format: { parser: 'typescript' },
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
  if (config?.controllers?.glob && !Array.isArray(config.controllers.glob)) {
    throw KitaError('controllers.glob must be an array of strings', {
      controllers: config.controllers
    });
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
