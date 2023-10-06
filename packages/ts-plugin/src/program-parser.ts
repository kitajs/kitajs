import { KitaConfig } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import { globSync } from 'glob';
import ts from 'typescript';

export async function parseSingleFile(
  config: KitaConfig,
  program: ts.Program,
  fileName: string,
  diagnostics: ts.Diagnostic[]
) {
  const providerPaths = globSync(config.providers.glob, { cwd: config.cwd });
  const parser = new KitaParser(config, [fileName], providerPaths, program);

  // As we only provides the [fileName], parser here will only parse the file
  // we are interested in.
  for await (const error of parser.parse()) {
    if (!error.diagnostic) {
      continue;
    }

    diagnostics.push();
  }
}
