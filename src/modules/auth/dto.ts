import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Represents the data required to log in a user.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
