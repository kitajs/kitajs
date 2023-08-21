import type { CustomParameter } from '@kitajs/runtime';
import type { FastifyReply, FastifyRequest } from 'fastify';

export type Result = 'ok' | 'error';
export type AuthMode = 'jwt' | 'basic';

export type AuthParam<Method extends AuthMode> = CustomParameter<Result>;

export function resolver(_req: FastifyRequest, _rep: FastifyReply, authMode: AuthMode): AuthParam<any> {
  return authMode === 'jwt' ? 'ok' : 'error';
}
