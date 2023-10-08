import { Body, Query } from '@kitajs/runtime';
import { userDatabase } from '../database';
import { CreateUser, User } from '../models/user';
import { UserId } from '../providers/user-id';

/**
 * @operationId getUser
 * @tag User
 * @summary Get a user by id
 */
export function get(id: Query) {
  return userDatabase.get(id);
}

/**
 * @operationId createUser
 * @tag User
 * @summary Create a new user
 */
export function post(data: Body<CreateUser>, userId: UserId) {
  const user: User = {
    id: userId || String(userDatabase.size),
    name: data.name,
    createdAt: new Date()
  };

  userDatabase.set(user.id, user);

  return user;
}
