import { Html } from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { SuspenseId } from '@kitajs/runtime';
import { setTimeout } from 'node:timers/promises';

export async function get(id: SuspenseId) {
  return (
    <Suspense rid={id} fallback={<div>fallback</div>}>
      {setTimeout(100, 'Hello World')}
    </Suspense>
  );
}

export function post() {
  return <div>Hello World 1</div>;
}

export async function put() {
  return <div>Hello World 2</div>;
}
