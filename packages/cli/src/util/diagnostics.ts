import { AstCollector } from '@kitajs/common';
import chalk from 'chalk';
import ts from 'typescript';

export function formatDiagnostic(diagnostics: readonly ts.Diagnostic[]) {
  const formatter = process.stdout.isTTY ? ts.formatDiagnosticsWithColorAndContext : ts.formatDiagnostics;

  return (
    '\n' +
    formatter(diagnostics, {
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

export function formatStatus(collector: AstCollector, diagnostics: unknown[]) {
  const routes = collector.getRoutes();
  const schemas = collector.getSchemas();
  const providers = collector.getProviderCount();

  const routesText = `${routes.length ? chalk.green(routes.length) : chalk.red(routes.length)} routes`;
  const schemasText = `${schemas.length ? chalk.green(schemas.length) : chalk.yellow(schemas.length)} schemas`;
  const providersText = `${providers ? chalk.green(providers) : chalk.yellow(providers)} providers`;
  const errorsText = `${diagnostics.length ? chalk.red(diagnostics.length) : chalk.green(diagnostics.length)} errors`;

  return `${routesText} / ${schemasText} / ${providersText} | ${errorsText}`;
}
