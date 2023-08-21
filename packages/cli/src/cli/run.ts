import { importConfig, Kita } from '@kitajs/generator';
import path from 'node:path';

export async function run(options: Record<string, any>) {
  const configPath = process.env.KITA_CONFIG || path.resolve(process.cwd(), options.config);

  const root = path.dirname(configPath);
  const config = importConfig(configPath);
  const tsconfig = path.resolve(root, config.tsconfig);

  const kita = new Kita(tsconfig, config, root);

  kita.on('error', (err) => {
    console.error(err);
  });

  kita.on('kita-error', (err) => {
    console.error(err);
  });

  const routes = await kita.parse();

  console.dir(routes, { depth: null });
}
