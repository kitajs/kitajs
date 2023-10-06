import { isPromiseLike } from '@kitajs/common';
import deasync from 'deasync';
import { Promisable } from 'type-fest';

/** Adapted from https://www.npmjs.com/package/synchronized-promise to avoid requiring deasync every time. */
export function awaitSync<C>(promise: Promisable<C>) {
  if (!isPromiseLike(promise)) {
    return promise;
  }

  let done = false;
  let err = false;
  let res: C | undefined;

  promise.then(
    function fulfilled(r) {
      res = r;
      done = true;
    },
    function rejected(e) {
      err = true;
      done = true;
      res = e;
    }
  );

  deasync.loopWhile(function isPending() {
    return !done;
  });

  if (err) {
    throw res;
  }

  return res!;
}
