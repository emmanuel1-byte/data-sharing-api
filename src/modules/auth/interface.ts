/**
 * Represents a user with an email and password.
 */
export interface User {
  email: string;
  password: string;
}

/**
 * Extends the standard Express `Request` object with a `user` property that contains the user's `sub` (subject) identifier.
 */
export interface RequestWithUser extends Request {
  user: {
    sub: string;
  };
}
