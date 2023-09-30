import { KitaEventEmitter, mergeDefaults } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';

export async function dev() {
  const emitter = new KitaEventEmitter();

  const kita = new KitaParser(
    './tsconfig.json',
    mergeDefaults({
      providers: {
        glob: ['./src/providers/**.ts']
      },
      controllers: {
        glob: ['./src/routes/**.ts']
      }
    }),
    process.cwd(),
    emitter
  );

  emitter.on('kitaError', console.error);
  emitter.on('provider', console.log);
  emitter.on('route', console.log);

  await kita.parseProviders();
  await kita.parseRoutes();

  console.dir(kita.schemaBuilder.toSchemaArray(), { depth: null });
}
