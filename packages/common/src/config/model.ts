import { Config as JsonConfig, SubNodeParser, SubTypeFormatter } from 'ts-json-schema-generator';
import { ChainParser, ParameterParser, ProviderParser, RouteParser } from '../parsers';

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
   * The root folder to search and register providers. It must be the same relative directory as your
   * `KITA_PROJECT_ROOT` runtime variable.
   *
   * @default 'src'
   * @env `KITA_SRC` - The environment variable to override this setting.
   */
  src: string;

  /**
   * Uses a different located @kitajs/runtime. You should only override this setting if you are having problems with
   * your package manger or the runtime cannot be found by default.
   *
   * @default 'node_modules/@kitajs/runtime/generated'
   * @env `KITA_RUNTIME_PATH` - The environment variable to override this setting.
   */
  runtimePath: string;

  /**
   * If the generated runtime should include declaration files alongside the javascript files. This is only helpful for
   * development purposes and can be disabled once you are building the runtime for production.
   *
   * @default true
   * @env `KITA_DECLARATION` - The environment variable to override this setting.
   */
  declaration: boolean;

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
    [key: string | number]: any;
  };

  /** Use this callback to include new parameter parsers. */
  parameterParserAugmentor(parser: ChainParser<ParameterParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  routeParserAugmentor(parser: ChainParser<RouteParser>): void | Promise<void>;

  /** Use this callback to include new route parsers. */
  providerParserAugmentor(parser: ChainParser<ProviderParser>): void | Promise<void>;

  /** Configurations required by the watcher. */
  watch: {
    /**
     * All directories changes should be ignored.
     *
     * @default ['node_modules', 'dist', <runtime>]
     */
    ignore: string[];
  };
}

export interface KitaGeneratorConfig extends Omit<JsonConfig, 'tsconfig' | 'discriminatorType'> {
  /** Extra parsers to handle ts.Nodes into Schema Nodes */
  parsers: SubNodeParser[];
  /** Extra formatters to handle Schema Nodes into json schemas */
  formatters: SubTypeFormatter[];
}

/** A partial kita config interface. all possible customizations are done through this interface. */
export type PartialKitaConfig = Partial<KitaConfig>;
