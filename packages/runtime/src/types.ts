/** A type that can be a promise or not */
export type MaybePromise<T> = T | Promise<T>;

/** A native typescript type. */
export type Native = string | number | boolean | null | undefined;
