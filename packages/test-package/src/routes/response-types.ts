import type { Query, Route } from '@kitajs/runtime';
import type { HelloWorldQuery } from '../models/hello-world';
import { hello } from '../services/hello-world';

/** @tag Response Test */
export async function Get(
  this: Route<'withTypedPromiseResponse'>,
  { age, name }: Query<HelloWorldQuery>
): Promise<{ a: string }> {
  return {
    a: hello(name, age)
  };
}

/** @tag Response Test */
export async function Post(
  this: Route<'withInferredResponse', { preHandler: typeof preHandler }>,
  { age, name }: Query<HelloWorldQuery>
) {
  return {
    b: hello(name, age)
  };
}

export type PR = Promise<{ c: string }>;

/** @tag Response Test */
export async function Put(this: Route<'withPromiseTypeAlias'>, { age, name }: Query<HelloWorldQuery>): PR {
  return {
    c: hello(name, age)
  };
}

export type DR = { d: string };

/** @tag Response Test */
export async function Delete(this: Route<'withTypeAliasPromise'>, { age, name }: Query<HelloWorldQuery>): Promise<DR> {
  return {
    d: hello(name, age)
  };
}

// export async function errorHandler() {}

// export async function schemaErrorFormatter() {}

// export async function onRequest() {}

// export async function preParsing() {}

// export async function preValidation() {}

export async function preHandler() {}

// export async function preSerialization() {}

// export async function onSend() {}

// export async function onResponse() {}

// export async function onTimeout() {}

// export async function onError() {}
