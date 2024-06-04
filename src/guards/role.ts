import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Roles } from '..//decorators/role';
import { AuthService } from '../modules/auth/service';
import { AuthGuard } from './auth';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private authGuard: AuthGuard,
  ) {}

  /**
   * Checks if the current user has the required role to access the requested resource.
   * This guard is used to protect routes that require specific user roles.
   *
   * @param context The execution context of the current request.
   * @returns `true` if the user has the required role, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authResult = await this.authGuard.canActivate(context);
    if (!authResult) {
      return false;
    }
    const requiredRole = this.reflector.getAllAndOverride<Roles>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.authService.findUserById(request.user.sub);
    return user.role === requiredRole;
  }
}
