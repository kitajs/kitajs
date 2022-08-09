import { KitaGenerator } from '@kitajs/generator';
import fs from 'fs/promises';

export async function generate() {
  const generator = await KitaGenerator.build();

  const result = await generator.generate();

  const file = await generator.generateFile(result);

  await fs.writeFile(generator.outputPath, file, 'utf8');
}
