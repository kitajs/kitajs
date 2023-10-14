import type { HttpErrors as _HttpErrors } from '@fastify/sensible/lib/httpError';

/**
 * Allows you to throw HTTP errors. These errors are automatically added to your route response schema.
 *
 * Rules:
 *
 * - You MUST register `fastify-sensible` plugin before using this type.
 * - Only errors thrown with `throw` keyword are added.
 * - Kitajs _only_ reads this function body, errors thrown elsewhere are not added and you should try/catch these calls
 *   inside your route handler.
 *
 * ```ts
 * import { HttpErrors } from '@kitajs/runtime';
 *
 * export function get(errors: HttpErrors) {
 *   throw errors.notFound();
 * }
 *
 * export function get(errors: HttpErrors) {
 *   try {
 *     return anotherCallThatThrows();
 *   } catch (error) {
 *     throw errors.internalServerError(error);
 *   }
 * }
 * ```
 *
 * ## How to register:
 *
 * ```ts
 * import fastifySensible from '@fastify/sensible';
 *
 * // Needs `HttpError` schema id to be set:
 * app.register(fastifySensible, {
 *   sharedSchemaId: 'HttpError'
 * });
 * ```
 *
 * TODO: Remove this type as soon https://github.com/fastify/fastify-sensible/pull/147 is merged.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export type HttpErrors = _HttpErrors;
