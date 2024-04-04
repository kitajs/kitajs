import { Html } from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import type { FastifyRequest } from 'fastify';
import { setTimeout } from 'node:timers/promises';

export async function get({ id }: FastifyRequest) {
  return (
    <Suspense rid={id} fallback={<div>Fallback</div>}>
      {setTimeout(100, <div>Content</div>)}
    </Suspense>
  );
}

export function post() {
  return <div>Hello World 1</div>;
}

export async function put() {
  return <div>Hello World 2</div>;
}
