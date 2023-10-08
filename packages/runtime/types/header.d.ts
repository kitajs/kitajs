import type { Primitive } from 'type-fest';

/**
 * Extracted from the request headers. All headers are lowercased.
 *
 * @example Export function get( etag: Header<'etag'>, // <'etag', string> age: Header<'age', number>, ) {}
 */
export type Header<_Name extends Lowercase<string> = Lowercase<string>, _Type extends Primitive = string> = string;
