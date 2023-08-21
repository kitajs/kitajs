import type ts from 'typescript';
import { KitaError, SourceFileNotFoundError } from './errors';
import type { RouteParser } from './parsers';

export class AstTraverser {
  constructor(readonly parser: RouteParser, readonly program: ts.Program) {}

  /**
   * Parses all provided source files and returns a async list of routes.
   */
  parseRoutes(sources: ts.SourceFile[]) {
    return sources
      .flatMap((source) => source.statements)
      .map((statement) =>
        Promise.resolve(this.parser.supports(statement))
          .then((supports) => (supports ? this.parser.parse(statement) : undefined))
          .catch((error: KitaError) => error)
      );
  }

 

  /**
   * Attempts to find each controller his respective source file.
   */
  findSources(controllerPaths: string[]) {
    return controllerPaths.map((controllerPath) => {
      const sourceFile = this.program.getSourceFile(controllerPath);

      if (!sourceFile) {
        throw new SourceFileNotFoundError(controllerPath);
      }

      return sourceFile;
    });
  }
}
