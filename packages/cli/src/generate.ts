import { createKitaGenerator, generateAst } from '@kitajs/generator';
import chalk from 'chalk/';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';

const PRETTIER_OPTIONS: prettier.Options = {
  parser: 'typescript',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  insertPragma: false,
  bracketSameLine: false,
  jsxSingleQuote: false,
  printWidth: 90,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  requirePragma: false,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false
};

export async function generate() {
  const start = Date.now();

  const generator = await createKitaGenerator();

  console.log(`\n 🔬  Introspecting code...`);
  const ast = await generateAst(generator);

  console.log(
    `\n 🗃️   Read ${chalk.yellowBright(
      ast.schemas.length
    )} schemas and ${chalk.yellowBright(ast.routes.length)} routes.`
  );

  let file = await generator.loadRenderer('output.hbs').then((r) => r(ast));

  try {
    file = prettier.format(file, PRETTIER_OPTIONS);
  } catch (err) {
    console.error(
      '❌ Prettier could not format the output file, maybe it has a invalid syntax?'
    );
    console.error(err);
  }

  const local = `./${path.relative(process.cwd(), generator.outputPath)}`;
  console.log(`\n 🖨️   Exporting code to ${chalk.white(local)}`);

  await fs.writeFile(generator.outputPath, file, 'utf8');

  const time = (Date.now() - start) / 1000;
  console.log(`\n ⏱️   Took ${chalk.cyanBright(time.toFixed(2))} seconds.`);
}
