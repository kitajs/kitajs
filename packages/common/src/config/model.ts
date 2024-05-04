import type { Config as JsonConfig, SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import type { ChainParser, ParameterParser, ProviderParser, RouteParser } from '../parsers';

/** The kita config interface. all possible customizations are done through this interface. */
export interface KitaConfig {
  /**
   * The current working directory of the project. This is used to evaluate all relative paths.
   *
   * @default process.cwd()
   * @env `KITA_CWD` - The environment variable to override this setting.
   */
  cwd: string;

  /**
   * The root folder to search and register providers.
   *
   * @default 'src'
   * @env `KITA_SRC` - The environment variable to override this setting.
   */
  src: string;

  /**
   * If the output should be formatted to be more readable and reduce possible conflicts.
   *
   * @default 'process.stdout.isTTY'
   * @env `KITA_FORMAT` - The environment variable to override this setting.
   */
  format: boolean;

  /**
   * Uses a different located @kitajs/runtime. You should only override this setting if you are having problems with
   * your package manger or the runtime cannot be found by default.
   *
   * @default 'src/runtime.kita.ts'
   * @env `KITA_OUTPUT` - The environment variable to override this setting.
   */
  output: string;

  /**
   * The tsconfig path to use to parse the files.
   *
   * @default 'tsconfig.json'
   * @env `KITA_TSCONFIG` - The environment variable to override this setting.
   */
  tsconfig: string;

  /**
   * The config to the ts-json-schema-generator that is used to generate schemas from typescript AST.
   *
   * @default { encodeRefs: false, sortProps: true, strictTuples: true, jsDoc: 'extended' }
   * @env `KITA_GENERATOR_CONFIG` - The environment variable to override this setting as **json**.
   */
  generatorConfig: KitaGeneratorConfig;

  /**
   * General response types to append on all routes schemas.
   *
   * @default { }
   * @env `KITA_RESPONSES` - The environment variable to override this setting as **json**.
   */
  responses: {
    [key: string | number]: unknown;
  };

  /** Use this callback to include new parameter parsers. */
  parameterParserAugmentor(parser: ChainParser<ParameterParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  routeParserAugmentor(parser: ChainParser<RouteParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  providerParserAugmentor(parser: ChainParser<ProviderParser>): void | Promise<void>;

  /**
   * All directories changes should be ignored.
   *
   * @default ['node_modules', 'dist', <output>]
   */
  watchIgnore: string[];
}

export interface KitaGeneratorConfig extends Omit<JsonConfig, 'tsconfig' | 'discriminatorType' | 'functions'> {
  /** Extra parsers to handle ts.Nodes into Schema Nodes */
  parsers: SubNodeParser[];
  /** Extra formatters to handle Schema Nodes into json schemas */
  formatters: SubTypeFormatter[];
}

/** A partial kita config interface. all possible customizations are done through this interface. */
export type PartialKitaConfig = Partial<KitaConfig>;
