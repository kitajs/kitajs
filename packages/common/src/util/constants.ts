/** The name of the request parameter */
export const kRequestParam = 'req';

/** The name of the reply parameter */
export const kReplyParam = 'reply';

/** The name of the fastify instance parameter */
export const kFastifyParam = `${kRequestParam}.server`;

/** The name of the fastify variable */
export const kFastifyVariable = 'fastify';

/** The name of the transformSchema function */
export const kTransformSchema = 'transformSchema';

/** The name of the request parameter */
export const kKitaOptions = 'options';

/** The variable name of the controller import */
export const kControllerName = 'Controller';

/** The name of the root kita options. */
export const kOptionsRoot = 'root';

/** The name of the root kita options. */
export const kKitaRoot = 'KITA_PROJECT_ROOT';

/** The name of the root property kita will assign to `globalThis` */
export const kKitaGlobalRoot = `globalThis.${kKitaRoot}`;

/** The folder name where routes are stored */
export const kRoutesFolder = 'routes';

/** The folder name where providers are stored */
export const kProvidersFolder = 'providers';

/** The export name of all definitions that kita should export */
export const kSchemaDefinitions = 'KitaSchemas';
