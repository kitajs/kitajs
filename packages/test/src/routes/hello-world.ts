import type { Query, Route } from '@kita/runtime';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { hello } from '../services/hello-world';

export async function get(
  this: Route<
    'listUser',
    {
      preHandler: typeof a;
      bodyLimit: 1000;
      config: { a: [{ 3: 923 }, ';'] };
    }
  >,
  name: Query
) {
  return hello(name);
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
