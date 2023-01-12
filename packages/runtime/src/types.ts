/** A type that can be a promise or not */
export type MaybePromise<T> = T | Promise<T>;

/** A native javascript type. */
export type Native = string | number | boolean;
