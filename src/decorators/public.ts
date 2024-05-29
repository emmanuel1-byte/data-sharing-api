import { SetMetadata } from '@nestjs/common';

/**
 * Decorator that marks a class or method as public, allowing it to be accessed from outside the module.
 * The `isPublic` metadata key is set to `true` when this decorator is applied.
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
