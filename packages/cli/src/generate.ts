import { KitaGenerator } from '@kitajs/generator';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk/';

export async function generate() {
  const start = Date.now();

  const generator = await KitaGenerator.build();

  console.log(`\n 🔬  Introspecting code...`);
  const result = await generator.generate();

  console.log(
    `\n 🗃️   Read ${chalk.yellowBright(
      result.schemas.length
    )} schemas and ${chalk.yellowBright(result.routes.length)} routes.`
  );

  const file = await generator.generateFile(result);

  const local = './' + path.relative(process.cwd(), generator.outputPath);
  console.log(`\n 🖨️   Exporting code to ${chalk.white(local)}`);

  await fs.writeFile(generator.outputPath, file, 'utf8');

  const time = (Date.now() - start) / 1000;
  console.log(`\n ⏱️   Took ${chalk.cyanBright(time.toFixed(2))} seconds.`);
}
