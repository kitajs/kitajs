import { customParameter, CustomParameter } from '@kita/runtime';

export type AuthParam<Method extends 'jwt' | 'basic'> = CustomParameter<
  'ok' | 'error',
  [Method]
>;

export default customParameter<AuthParam<'jwt' | 'basic'>>((req, rep, params) => {
  return 'ok';
});
