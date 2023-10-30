import ts from 'typescript';

export function formatDiagnostic(diagnostics: readonly ts.Diagnostic[]) {
  return (
    '\n' +
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName(fileName) {
        return fileName;
      },
      getCurrentDirectory() {
        return process.cwd();
      },
      getNewLine() {
        return '\n';
      }
    })
  );
}
