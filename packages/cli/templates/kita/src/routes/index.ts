import type { Body, Query } from '@kitajs/runtime';
import type { FastifyRequest } from 'fastify';

/** A dto for creating a user */
interface CreateUser {
  /**
   * @minLength 5
   * @maxLength 20
   */
  name: string;

  /** @format email */
  email: string;
}

/**
 * Simply returns a hello message
 *
 * @tag Hello
 * @operationId getHello
 * @summary Get a hello message
 */
export function get(name: Query = 'World') {
  return {
    name,
    message: `Hello ${name}!`
  };
}

/**
 * Creates a user and logs it
 *
 * @tag User
 * @operationId createUser
 * @summary Create a user
 */
export function post(data: Body<CreateUser>, { log }: FastifyRequest) {
  log.info('User created', data);

  return {
    created: 'User created'
  };
}
