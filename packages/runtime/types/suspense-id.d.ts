/**
 * The {@linkcode SuspenseId} just resolves to `reply.id`. Its main usage is to be used with html routes.
 *
 * When used within a html route, its result will be piped into `@kitajs/html`'s renderToStream function and **support
 * for `Suspense` components will be enabled**.
 *
 * @example
 *
 * ```tsx
 * export function get(id: SuspenseId) {
 *   return (
 *     <Suspense rid={id} fallback={<div>Loading...</div>}>
 *       <User id={id} />
 *     </Suspense>
 *   );
 * }
 * ```
 */
export type SuspenseId = number;
