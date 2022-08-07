import type { CustomParameter, Rep, Req, RouteContext } from '@kita/runtime';

type Result = 'ok' | 'error';
type AuthMode = 'jwt' | 'basic';

export type AuthParam<Method extends AuthMode> = CustomParameter<Result, [AuthMode]>;

export default function (
  this: RouteContext,
  req: Req,
  rep: Rep,
  params: [AuthMode]
): AuthParam<any> {
  return 'ok';
}
