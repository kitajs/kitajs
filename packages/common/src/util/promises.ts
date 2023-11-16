import { Promisable } from 'type-fest';

/** Resolves the first predicate that returns true. Otherwise, returns literal `false`. */
export function predicateRace<
  Args extends unknown[],
  K extends string,
  R extends Record<K, (...a: Args) => Promisable<boolean>>
>(resolvers: Iterable<R>, maxTries: number, callKey: K, ...args: Args): Promise<false | R> {
  let resolved = 0;
  let promise: Promisable<boolean>;

  return new Promise(function predicatePromise(resolve, reject) {
    for (const resolver of resolvers) {
      promise = resolver[callKey](...args);

      if (!(promise instanceof Promise)) {
        promise = Promise.resolve(promise);
      }

      promise.then(
        function resolvePredicate(result) {
          // Promise was resolved before
          if (resolved >= maxTries) {
            return;
          }

          // We got a result
          if (result) {
            // Marks all other resolvers as resolved (so we can ignore their results)
            resolved = maxTries;

            // Resolves current promise
            return resolve(resolver);
          }

          // Marks this resolver as resolved
          resolved++;

          // If all resolvers have been resolved, we can resolve this promise
          // with false
          if (resolved >= maxTries) {
            return resolve(false);
          }
        },
        function handlePredicateError(error) {
          // Marks all other resolvers as resolved (so we can ignore their results)
          resolved = maxTries;

          // Reject current promise
          return reject(error);
        }
      );
    }
  });
}

/**
 * Fast instanceof check for promises. This is faster than `value instanceof Promise` because it does not need to
 * traverse the prototype chain.
 */
export function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
  //@ts-expect-error - We are checking for the existence of the `then` method
  return !!value && typeof value.then === 'function';
}
