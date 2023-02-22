export abstract class BaseParameter {
  /**
   * Any code that needs to be executed before, to this parameter work
   *
   * @example `const resolved = await CustomParameterResolver.resolve(param)`
   */
  public abstract getHelper(): string | undefined;

  /**
   * The resolved parameter text to be evaluated
   *
   * @example `req.params.id`
   */
  public abstract getValue(): string | undefined;
}