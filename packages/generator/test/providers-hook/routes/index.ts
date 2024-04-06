import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { H1 } from '../providers/application';
import type { H2 } from '../providers/lifecycle';
import type { H3 } from '../providers/mix';
import type { H4 } from '../providers/none';

export function get(t1: H1, app: FastifyInstance) {
  return {
    t1,
    //@ts-expect-error
    app: app.h1r
  };
}

export function post(t2: H2, app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  return {
    t2,
    //@ts-expect-error
    app2: app.h2h,
    //@ts-expect-error
    request: request.h2h,
    //@ts-expect-error
    reply: reply.h2h
  };
}

export function put(t3: H3, app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  return {
    t3,
    //@ts-expect-error
    app1: app.h3r,
    //@ts-expect-error
    app2: app.h3h,
    //@ts-expect-error
    request: request.h3h,
    //@ts-expect-error
    reply: reply.h3h
  };
}

export function Delete(t4: H4) {
  return {
    t4
  };
}
