import type { FastifyRequest } from 'fastify';

export type UserId = string | undefined;

export default function (req: FastifyRequest): UserId {
  const xUserId = req.headers['x-user-id'];
  return xUserId ? String(xUserId) : undefined;
}
