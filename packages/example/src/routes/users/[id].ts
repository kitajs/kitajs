import { Path } from '@kitajs/runtime';
import { userDatabase } from '../../database';

/**
 * @operationId getUser
 * @tag User
 * @summary Get a user by id
 */
export function get(id: Path) {
  return userDatabase.get(id);
}
