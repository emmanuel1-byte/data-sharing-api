import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'src/decorators/public';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  /**
   * Determines if the current request is authorized to access the requested resource.
   *
   * This guard checks if the requested resource is public. If it is, the request is allowed to proceed.
   * If the resource is not public, the guard attempts to extract a JWT token from the request headers.
   * If a token is found, the guard verifies the token and attaches the decoded payload to the request object.
   * If no token is found or the token is invalid, the guard throws an UnauthorizedException.
   *
   * @param context The execution context of the current request.
   * @returns `true` if the request is authorized, `false` otherwise.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts the token from the 'Authorization' header of the given request.
   * If the header is present and starts with 'Bearer ', the token is returned.
   * Otherwise, `undefined` is returned.
   *
   * @param request - The HTTP request object.
   * @returns The token if present, or `undefined` if not.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization'].split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
