import type { CustomParameter, Rep, Req, RouteContext } from '@kitajs/runtime';

export type Result = 'ok' | 'error';
export type AuthMode = 'jwt' | 'basic';

export type AuthParam<Method extends AuthMode> = CustomParameter<Result, [Method]>;

export default function (
  this: RouteContext,
  _req: Req,
  _rep: Rep,
  _params: [AuthMode]
): AuthParam<any> {
  return 'ok';
}
