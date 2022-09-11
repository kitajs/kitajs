import { createKitaGenerator, generateAst } from '@kitajs/generator';
import path from 'path';
import 'ts-node/register/transpile-only';
import ts from 'typescript';

// Matches `require("./`
const START_REQUIRE_REGEX = /require\("(\.\/.+)"\)/g;

export async function generateKita() {
  const generator = await createKitaGenerator();
  const ast = await generateAst(generator);
  //@ts-ignore - unknown type error at runtime
  const code = await generator.loadRenderer('output.hbs').then((r) => r(ast));

  const transpiled = ts
    .transpile(code, { importHelpers: true })
    .replace(
      START_REQUIRE_REGEX,
      (_, p1) =>
        `require('${path.relative(__dirname, path.join(generator.outputFolder, p1))}')`
    );

  // const module = { exports: {} };

  eval(transpiled);

  return module.exports.Kita as typeof import('../src/routes').Kita;
}

export type Kita = typeof import('../src/routes').Kita;
