import { isPromiseLike } from '@kitajs/common';
import deasync from 'deasync';
import { Promisable } from 'type-fest';

export function sync<C>(promise: Promisable<C>) {
  if (!isPromiseLike(promise)) {
    return promise;
  }

  let done = false;
  let error = false;
  let result: C | undefined;

  promise.then(
    function fulfilled(r) {
      result = r;
      done = true;
    },
    function rejected(error) {
      error = true;
      result = error;
      done = true;
    }
  );

  deasync.loopWhile(function isPending() {
    return !done;
  });

  if (error) {
    throw result;
  }

  return result!;
}
