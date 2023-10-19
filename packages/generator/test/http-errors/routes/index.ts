import { HttpErrors } from '@fastify/sensible';
import type { Query } from '@kitajs/runtime';

export function get(errors: HttpErrors, num?: Query<number>) {
  switch (num) {
    case 1:
      throw errors.badRequest('Error 1!');
    case 2:
      throw errors.internalServerError('Error 2!');
    default:
      return 'Success!';
  }
}
