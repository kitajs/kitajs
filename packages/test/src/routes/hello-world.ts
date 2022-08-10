import type { Query, Route } from '@kitajs/runtime';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { hello } from '../services/hello-world';

export type Extended = {
  a: number;
  b: number;
};

export async function get(
  this: Route<'listUser', { preHandler: typeof a }>,
  age: Query<Extended>
) {
  console.log(age);
  return hello(JSON.stringify(age));
}

// export async function errorHandler() {}

// export async function schemaErrorFormatter() {}

// export async function onRequest() {}

// export async function preParsing() {}

// export async function preValidation() {}

export const a: preHandlerAsyncHookHandler = async () => {};

// export async function preSerialization() {}

// export async function onSend() {}

// export async function onResponse() {}

// export async function onTimeout() {}

// export async function onError() {}
