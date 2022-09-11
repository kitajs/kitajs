/**
 * A parameter of a route, either a Rest, Websocket or custom one.
 */
export interface Parameter {
  /**
   * Any code that needs to be executed before, to this parameter work
   *
   * @example `const resolved = await CustomParameterResolver.resolve(param)`
   */
  helper?: string;

  /**
   * The resolved parameter text to be evaluated
   *
   * @example `req.params.id`
   */
  value: string;
}
