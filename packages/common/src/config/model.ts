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
   * The root provider folder to search and register providers
   *
   * @default 'src/providers'
   * @env `KITA_PROVIDER_FOLDER` - The environment variable to override this setting.
   */
  providerFolder: string;

  /**
   * The root route folder to search and register routes
   *
   * @default 'src/routes'
   * @env `KITA_ROUTE_FOLDER` - The environment variable to override this setting.
   */
  routeFolder: string;

  /**
   * Uses a different located @kitajs/runtime. You should only override this setting if you are having problems with
   * your package manger or the runtime cannot be found by default.
   *
   * @default undefined
   * @env `KITA_RUNTIME_PATH` - The environment variable to override this setting.
   */
  runtimePath?: string;

  /**
   * If the generated could should import routes from the dist folder instead of the source folder. Type declarations
   * still are always imported from the source folder.
   *
   * Useful if you are using tsx/ts-node/swc/swc to run your backend as raw typescript files instead of transpiling
   * them.
   *
   * Tries to resolve `compilerOptions.outDir` and if not found, fallbacks to `'dist'`.
   *
   * @default true
   * @env `KITA_DIST` - The environment variable to override this setting.
   */
  dist?: boolean;

  /**
   * The custom path to your source root. Used when replacing the source path with the dist path.
   *
   * @default 'src'
   * @env `KITA_SRC` - The environment variable to override this setting.
   */
  src: string;

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

  /** The dev server configuration. Used when running `kita dev`. */
  dev: KitaDevServer;
}

export interface KitaGeneratorConfig extends Omit<JsonConfig, 'tsconfig' | 'discriminatorType'> {
  /** Extra parsers to handle ts.Nodes into Schema Nodes */
  parsers: SubNodeParser[];
  /** Extra formatters to handle Schema Nodes into json schemas */
  formatters: SubTypeFormatter[];
}

/** A partial kita config interface. all possible customizations are done through this interface. */
export type PartialKitaConfig = Partial<KitaConfig>;

/** Simple matcher to be passed to `chokidar` and `anymatch`. */
type Matcher = string | RegExp | ((test: string) => boolean);

export interface KitaDevServer {
  /**
   * The file path to the JS server file to run. Use false to disable starting the server.
   *
   * @default 'node --inspect=1228 dist/index.js'
   */
  server: string | false;

  /**
   * The PID file path to write the server PID.
   *
   * @default 'dist/server.pid'
   */
  pid: string;

  /**
   * The folder to watch and restart the server on changes. Defaults to dist folder and kita's generated runtime.
   *
   * @default `dist/\*\*\/\*`
   */
  watch: string | string[] | false;

  /**
   * The folder/glob to ignore when watching.
   *
   * @default undefined
   */
  ignore?: Matcher | Matcher[];

  /**
   * The debounce time to wait before restarting the server.
   *
   * @default 2000
   */
  debounce: number;

  /**
   * If the server should warn when starting/resarting.
   *
   * @default true
   */
  warn: boolean;

  /**
   * If the bell sound should play on server restart.
   *
   * @default true
   */
  bell: boolean;

  /**
   * If the console should be cleared on server restart.
   *
   * @default true
   */
  clear: boolean | 'screen';

  /**
   * An array of hooks to run on events.
   *
   * @default `[{ watch: ['src/providers/\*\*\/\*', 'src/routes/\*\*\/\*'], exec: 'npx kita build', debounce: 1000, init: true }, { exec: 'npx tsc --watch --preserveWatchOutput', debounce: 1000, async: true, init: true }]`
   */
  hooks: KitaDevHook[];
}

export interface KitaDevHook {
  /**
   * The file path/glob to watch.
   *
   * @example `dist/**\/*`
   */
  watch?: string | string[];

  /**
   * The file path/glob to ignore.
   *
   * @example `src/**\/*.spec.ts`
   */
  ignore?: Matcher | Matcher[];

  /**
   * The command to run.
   *
   * @example 'npm run build'
   */
  exec: string;

  /** The internal debounced runner. This is set by the dev server. */
  run?: Function;

  /**
   * If the command **also** should be run on startup.
   *
   * @example `true`
   */
  init?: boolean;

  /**
   * If the command **also** should be run after the server restarts.
   *
   * @example `true`
   */
  post?: boolean;

  /**
   * If the command should be run asynchronously.
   *
   * @default false
   */
  async?: boolean;

  /**
   * The debounce time to wait before running the command.
   *
   * @example 2000
   */
  debounce?: number;
}
