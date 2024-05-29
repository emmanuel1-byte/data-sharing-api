/**
 * Represents a company with basic information.
 * @property {string} companyName - The name of the company.
 * @property {number} users - The number of users associated with the company.
 * @property {number} products - The number of products offered by the company.
 * @property {number} percentage - The percentage value associated with the company.
 */
export interface Company {
  companyName: string;
  users: number;
  products: number;
  percentage: number;
}

/**
 * Extends the standard Express `Request` object with a `user` property that contains the user's `sub` (subject) identifier.
 */
export interface RequestWithUser extends Request {
  user: {
    sub: string;
  };
}
