/**
 * This parameter can only be used inside a provider function. It resolves to all generics of the provider function.
 *
 * This is very useful when you want to create a generic provider function that can be used in multiple routes with
 * subtle differences, like changing the behavior mode.
 *
 * @example
 *
 * ```ts
 * // routes/test.ts
 *
 * export function get(test: Test<'Hello'>) {
 *   // ...
 * }
 *
 * // providers/test.ts
 *
 * export type Test<T extends string = string> = number;
 *
 * export default function (generics: ProviderGenerics<[string]>): Test {
 *   console.log(generics); // ["Hello"]
 *   return 1;
 * }
 * ```
 */
export type ProviderGenerics<T = (string | number | boolean)[]> = T;
