import type { Query, Route } from '@kitajs/runtime';
import type { AuthParam, Result } from '../helpers/auth-param';
import type { HelloWorldQuery, HWData } from '../models/hello-world';
import { hello } from '../services/hello-world';

export async function Post(
  this: Route<'helloWorld5'>,
  { age, name }: Query<HelloWorldQuery>
): Promise<HWData> {
  return {
    e: hello(name, age)
  };
}

type C = { f: Result };

export async function Get(
  this: Route<'helloWorld6'>,
  auth: AuthParam<'jwt'>
): Promise<C> {
  return {
    f: auth
  };
}
