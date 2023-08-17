import { V2, mergeDefaults } from '@kitajs/generator';

export async function dev() {
  const kita = new V2.Kita(
    './tsconfig.json',
    mergeDefaults({
      providers: {
        glob: ['./src/providers/**.ts']
      },
      controllers: {
        glob: ['./src/routes/**.ts']
      }
    }),
    process.cwd()
  );

  kita.on('kita-error', console.error);
  kita.on('provider', console.log);
  kita.on('route', console.log);

  await kita.buildProviders();
  await kita.buildRoutes();

  console.dir(kita.schemaBuilder.toSchemaArray(), { depth: null });
}
