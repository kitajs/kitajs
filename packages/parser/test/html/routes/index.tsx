import Html from '@kitajs/html';
import { Suspense } from '@kitajs/html/suspense';
import type { FastifyRequest } from 'fastify';

export function get({ id }: FastifyRequest) {
  return (
    <>
      {'<!doctype html>'}
      <Suspense rid={id} fallback={<div>fallback</div>}>
        Hello World
      </Suspense>
    </>
  );
}

export function post() {
  return <div>Hello World</div>;
}

export async function put() {
  return <div>Hello World</div>;
}
