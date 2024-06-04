import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './service';
import { LoginDto } from './dto';
import { Public } from '../../decorators/public';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and returns the signed in user.
   *
   * @param loginDto - The login data containing the user's credentials.
   * @returns The authenticated user.
   */
  @Public()
  @Post('/login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<any> {
    return await this.authService.signIn(loginDto);
  }
}
