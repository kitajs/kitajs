import { EOL } from 'os';
import ts from 'typescript';

export function formatDiagnostic(diagnostics: readonly ts.Diagnostic[]) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName(fileName) {
      return fileName;
    },
    getCurrentDirectory() {
      return process.cwd();
    },
    getNewLine() {
      return EOL;
    }
  });
}
