import { SetMetadata } from '@nestjs/common';

/**
 * Enum representing the different user roles in the application.
 *
 * @property {string} UserA - The role for User A.
 * @property {string} UserB - The role for User B.
 */
export enum Roles {
  UserA = 'UserA',
  UserB = 'UserB',
}

/**
 * Defines a constant key used to store role metadata on a class or method.
 */
export const ROLES_KEY = 'role';
export const Role = (role: Roles) => SetMetadata(ROLES_KEY, role);
