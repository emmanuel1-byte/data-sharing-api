import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Represents the data required to log in a user.
 */
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
