import { Config as JsonConfig, SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import { ChainParser, ParameterParser, ProviderParser, RouteParser } from '../parsers';

/** The kita config interface. all possible customizations are done through this interface. */
export interface KitaConfig {
  /** The current working directory of the project. This is used to evaluate all relative paths. */
  cwd: string;

  /**
   * The root directory to search for files.
   *
   * @default 'src'
   */
  source: string;

  /**
   * The root provider folder to search and register providers
   *
   * @default 'providers'
   */
  providerFolder: string;

  /**
   * The root route folder to search and register routes
   *
   * @default 'routes'
   */
  routeFolder: string;

  /**
   * Uses a different located @kitajs/runtime. You should only override this setting if you are having problems with
   * your package manger or the runtime cannot be found by default.
   */
  runtimePath?: string;

  /**
   * The tsconfig path to use to parse the files.
   *
   * @default 'tsconfig.json'
   */
  tsconfig: string;

  /**
   * The config to the ts-json-schema-generator that is used to generate schemas from typescript AST.
   *
   * @default { encodeRefs: true, sortProps: true, strictTuples: true, jsDoc: 'extended' }
   */
  generatorConfig: KitaGeneratorConfig;

  /**
   * General response types to append on all routes schemas.
   *
   * @default { }
   * @see https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/#serialization
   */
  responses: {
    [key: string | number]: any;
  };

  /** Use this callback to include new parameter parsers. */
  parameterParserAugmentor(parser: ChainParser<ParameterParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  routeParserAugmentor(parser: ChainParser<RouteParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  providerParserAugmentor(parser: ChainParser<ProviderParser>): void | Promise<void>;
}

export interface KitaGeneratorConfig extends Omit<JsonConfig, 'tsconfig'> {
  /** Extra parsers to handle ts.Nodes into Schema Nodes */
  parsers: SubNodeParser[];
  /** Extra formatters to handle Schema Nodes into json schemas */
  formatters: SubTypeFormatter[];
}

/** A partial kita config interface. all possible customizations are done through this interface. */
export type PartialKitaConfig = Partial<KitaConfig>;
