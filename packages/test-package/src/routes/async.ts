import type { AsyncRoute, Route } from '@kitajs/runtime';
import Piscina from 'piscina';
import { isMainThread } from 'worker_threads';

export function get(this: AsyncRoute<'asyncTest'>) {
  console.log({ isMainThread, isWorkerThread: Piscina.isWorkerThread });
  while (true) {}
}

export function post(this: Route<'syncTest'>) {
  console.log({ isMainThread, isWorkerThread: Piscina.isWorkerThread });
  while (true) {}
}
