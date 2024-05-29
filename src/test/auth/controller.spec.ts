import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../modules/auth/controller';
import { AuthService } from '../../modules/auth/service';
import { LoginDto } from '../../modules/auth/dto';
import { UnauthorizedException } from '@nestjs/common';

/**
 * Unit tests for the AuthController.
 */
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return the authenticated user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = { message: 'Login successful', access_token: 'token' };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toBe(result);
      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new UnauthorizedException('Incorrect credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.signIn).toHaveBeenCalledWith(loginDto);
    });
  });
});
