import type * as Prettier from 'prettier';
import { SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import { ParameterParser, ProviderParser, RouteParser } from '../parsers';

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
     * The regex to extract the route controller pathname from the absolute path.
     * 
     * Defaults to everything before the routes folder.
     *
     * @default /^(.+?\/routes\/)/
     */
    prefix: string | RegExp;
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
   * Use this callback to include new parameter parsers.
   */
  parameterParserAugmentor?(parser: ParameterParser): void | Promise<void>;

  /**
   * Use this callback to include new route parsers.
   */
  routeParserAugmentor?(parser: RouteParser): void | Promise<void>;

  /**
   * Use this callback to include new route parsers.
   */
  providerParserAugmentor?(parser: ProviderParser): void | Promise<void>;
}
