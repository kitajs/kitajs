/** The AST definition for a kitajs route parameter. */
export interface Parameter {
  /** The parameter Id, like `Body`, `Query`, `Provider`, etc. */
  name: string;

  /**
   * The resolved parameter text to be evaluated
   *
   * @example `req.params.id`
   */
  value: string;

  /**
   * Any code that needs to be executed before, to this parameter work
   *
   * @example `const resolved = await CustomParameterResolver.resolve(param)`
   */
  helper?: string;

  /** If this parameters needs any additional imports. */
  imports?: { name: string; path: string }[];

  /**
   * If this route has a schema transformer attached to it. It may or may not have a configuration
   *
   * Use string to specify multiple parameters
   */
  schemaTransformer?: boolean | string[];

  /**
   * The name of the provider to import for the schemaTransformer
   *
   * @example `TestProvider`
   */
  providerName?: string;

  /** If this is true, the current parameter will be ignored by the parser. */
  ignore?: boolean;

  /** Any code/content that needs to be static written in the top of the file. */
  static?: string;
}
