import { User } from '../models/user';

/**
 * Obviously you would not want to store your database in memory. and use a real database like Postgres, MongoDB, etc.
 *
 * This is just an example.
 */
export const userDatabase = new Map<string, User>();
