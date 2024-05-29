import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/auth/interface';
import { AuthService } from '../../modules/auth/service';

/**
 * Unit tests for the AuthService.
 */
describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return access token if credentials are valid', async () => {
      const mockUser: User = {
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await authService.signIn(mockUser);
      expect(result).toEqual({
        message: 'Login successfull',
        access_token: 'token',
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        existingUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: existingUser.id,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const mockUser: User = {
        email: 'test@example.com',
        password: 'password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.signIn(mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser: User = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.signIn(mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        existingUser.password,
      );
    });
  });

  describe('findUserById', () => {
    it('should return the user if found', async () => {
      const userId = '1';
      const existingUser = { id: '1', email: 'test@example.com' };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      const result = await authService.findUserById(userId);
      expect(result).toEqual(existingUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '1';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.findUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
