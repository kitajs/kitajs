import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import { SuspenseId } from '@kitajs/runtime';

export function get(id: SuspenseId) {
  return (
    <Suspense rid={id} fallback={<div>fallback</div>}>
      Hello World
    </Suspense>
  );
}

export function post() {
  return <div>Hello World</div>;
}

export async function put() {
  return <div>Hello World</div>;
}
