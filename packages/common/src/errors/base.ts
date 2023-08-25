/**
 * A KitaError instance is thrown when something goes wrong during the
 * parsing, resolving or generation process.
 *
 * All errors that you can expect to be thrown by Kita are subclasses of this
 * class.
 */
export abstract class KitaError extends Error {
  /**
   * This property can be mutated at runtime by the user to indicate that the
   * error has been resolved or handled.
   */
  public suppress = false;

  /**
   * The error code.
   *
   * This is a 3 digit number, where the first digit is the category of the error, and the last 2 digits are the error
   * code.
   *
   * | Code | Category  |
   * | ---- | --------- |
   * | 1    | General   |
   * | 2    | Config    |
   * | 3    | Parser    |
   * | 4    | Validator |
   */
  public abstract code: number;

  // We may use line breaks in the code to improve readability, but we don't want
  // to show them to the user, so we remove them.
  constructor(message: string) {
    // multiline trim
    super(message.replace(/^\s+|\s+$/gm, ''));
  }
}

/**
 * A KitaError instance is thrown when something goes wrong during the
 * parsing, resolving or generation process.
 */
export class UnknownKitaError extends KitaError {
  code = -1;

  constructor(readonly data?: unknown) {
    super('Unknown error');
  }
}
