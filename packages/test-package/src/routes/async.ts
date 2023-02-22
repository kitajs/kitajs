import type { AsyncRoute, Route } from '@kitajs/runtime';
import { isMainThread } from 'worker_threads';
import Piscina from 'piscina';

export function get(this: AsyncRoute<'asyncTest'>) {
  console.log({ isMainThread, isWorkerThread: Piscina.isWorkerThread });
  while (true) {}
}

export function post(this: Route<'syncTest'>) {
  console.log({ isMainThread, isWorkerThread: Piscina.isWorkerThread });
  while (true) {}
}
