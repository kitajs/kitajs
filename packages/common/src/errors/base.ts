import ts from 'typescript';

export type PartialDiagnostic = Omit<ts.Diagnostic, 'category' | 'file' | 'start' | 'length'> & {
  file?: ts.SourceFile;
  start?: number;
  length?: number;

  /** If we should populate `file`, `source`, `start` and `length` with this node information */
  node?: ts.Node;

  /** @default Error */
  category?: ts.DiagnosticCategory;
};

/**
 * A KitaError instance is thrown when something goes wrong during the parsing, resolving or generation process.
 *
 * All errors that you can expect to be thrown by Kita are subclasses of this class.
 */
export abstract class KitaError extends Error {
  /** This property can be mutated at runtime by the user to indicate that the error has been resolved or handled. */
  public suppress = false;

  /**
   * The error code.
   *
   * This is a 3 digit number, where the first digit is the category of the error, and the last 2 digits are the error
   * code.
   *
   * | Code | Category                  |
   * | ---- | ------------------------- |
   * | 1    | General                   |
   * | 2    | Config                    |
   * | 3    | Parser                    |
   * | 4    | Validator                 |
   * | 5    | Formatter                 |
   * | 6    | ts-html-plugin (external) |
   */
  readonly code: number;

  readonly diagnostic: ts.Diagnostic & { __kita: true };

  constructor(diagnostic: PartialDiagnostic) {
    super(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    this.diagnostic = KitaError.createDiagnostic(diagnostic);
    this.code = this.diagnostic.code;
  }

  static createDiagnostic(diagnostic: PartialDiagnostic) {
    // Swap the node for the file, source, start and length properties
    if (diagnostic.node && diagnostic.node.pos !== -1) {
      diagnostic.file = diagnostic.node.getSourceFile();
      diagnostic.start = diagnostic.node.getStart();
      diagnostic.length = diagnostic.node.getWidth();

      delete diagnostic.node;
    }

    // @ts-expect-error - TODO: Should we keep as string or do some maths to get
    // the correct category?
    diagnostic.code = `kita - ${diagnostic.code}`;
    diagnostic.category ??= ts.DiagnosticCategory.Error;

    return Object.assign(
      {
        category: ts.DiagnosticCategory.Error,
        file: undefined,
        length: 0,
        start: 0
      },
      diagnostic,
      {
        __kita: true
      }
    ) as ts.Diagnostic & { __kita: true };
  }
}

/** A KitaError instance is thrown when something goes wrong during the parsing, resolving or generation process. */
export class UnknownKitaError extends KitaError {
  constructor(
    message: string,
    readonly data?: unknown
  ) {
    super({
      messageText: `Unknown error: ${message}`,
      code: -1
    });
  }
}

export class UnknownNodeError extends KitaError {
  constructor(node: ts.Node, messageText: string) {
    super({
      code: -1,
      messageText,
      node
    });
  }
}
