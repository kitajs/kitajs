/**
 * The AST definition for a kitajs route parameter.
 */
export interface Parameter {
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

  /**
   * If this parameters needs any additional imports.
   */
  imports?: string[];

  /**
   * Any code that needs to be executed before, to this parameter work
   *
   * @example CustomParameterResolver`
   */
  providerName?: string;

  /**
   * If this route has a schema transformer attached to it. It may or may not have a configuration
   */
  schemaTransformer?: boolean;
}
