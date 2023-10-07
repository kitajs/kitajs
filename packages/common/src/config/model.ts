import { SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import { ChainParser, ParameterParser, ProviderParser, RouteParser } from '../parsers';

/** The kita config interface. all possible customizations are done through this interface. */
export interface KitaConfig {
  /**
   * The tsconfig path
   *
   * @default './tsconfig.json'
   */
  tsconfig: string;

  /**
   * The current working directory to resolve all files
   *
   * @default process.cwd()
   */
  cwd: string;

  /**
   * A custom path to the kitajs/runtime package. Useful if you are having problems with custom package managers like
   * yarn pnp.
   *
   * @default undefined
   */
  runtime?: string;

  schema: {
    /**
     * General response types to append on all routes schemas.
     *
     * @default { }
     * @see https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/#serialization
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
     * @default ['src/routes/⁎⁎/⁎.tsx?']
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
     * @default ['src/providers/⁎⁎/⁎.ts']
     */
    glob: string[];
  };

  /** Use this callback to include new parameter parsers. */
  parameterParserAugmentor?(parser: ChainParser<ParameterParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  routeParserAugmentor?(parser: ChainParser<RouteParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  providerParserAugmentor?(parser: ChainParser<ProviderParser>): void | Promise<void>;
}
