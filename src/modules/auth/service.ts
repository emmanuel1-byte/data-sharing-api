import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service';
import { User } from './interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

/**
 * Provides authentication-related services.
 */
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user by verifying their email and password.
   *
   * @param user - The user object containing the email and password to authenticate.
   * @returns An object containing a success message and an access token if the authentication is successful.
   * @throws UnauthorizedException if the email or password is incorrect.
   */
  async signIn(user: User): Promise<any> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });

    if (
      !existingUser ||
      !(await bcrypt.compare(user.password, existingUser.password))
    ) {
      throw new UnauthorizedException('Incorrect credentials');
    }
    return {
      message: 'Login succesfull',
      access_token: await this.jwtService.signAsync({ sub: existingUser.id }),
    };
  }

  async findUserById(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
