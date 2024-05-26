import { addAjvSchemas } from '@kitajs/runtime';
import envSchema from 'env-schema';
import type { Environment } from '../providers/schemas';
import { KitaSchemas } from '../runtime.kita';

/** Environment variables defined by {@linkcode Environment} */
export const Env = envSchema<Environment>({
  ajv: addAjvSchemas(KitaSchemas),
  dotenv: true,
  schema: KitaSchemas.Environment
});
