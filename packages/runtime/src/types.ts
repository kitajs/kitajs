/** A type that can be a promise or not */
export type MaybePromise<T> = T | Promise<T>;

/** A native javascript type. */
export type Native = string | number | boolean;

/** A partial that works for nested objects */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
