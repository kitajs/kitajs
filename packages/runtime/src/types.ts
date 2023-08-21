/** A type that can be a promise or not */
export type MaybePromise<T> = T | Promise<T>;

/** A native typescript type. */
export type Native = string | number | boolean | null | undefined | URL | RegExp | Date;

/**
 * A type that can be a native type or, array of native types or a record of native values.
 */
export type ShallowNative<Type = any> = Native | Native[] | { [key in keyof Type]?: Native | Native[] };
