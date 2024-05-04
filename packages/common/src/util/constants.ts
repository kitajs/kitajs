/** The name of the request parameter */
export const kRequestParam = 'r'; // minified to reduce bundle size

/** The name of the reply parameter */
export const kReplyParam = 'p'; // minified to reduce bundle size

/** The name of the fastify instance parameter */
export const kFastifyParam = `${kRequestParam}.server`;

/** The name of the fastify variable */
export const kFastifyVariable = 'f'; // minified to reduce bundle size

/** The name of the transformSchema function */
export const kTransformSchema = 'transformSchema';

/** The name of the request parameter */
export const kKitaOptions = 'options';

/** The folder name where routes are stored */
export const kRoutesFolder = 'routes';

/** The folder name where providers are stored */
export const kProvidersFolder = 'providers';

/** The export name of all definitions that kita should export */
export const kSchemaDefinitions = 'KitaSchemas';
