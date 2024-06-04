import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Represents the data required to create a new company.
 */
export class CreateCompanyDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  @IsNumber()
  users: number;

  @IsNotEmpty()
  @IsNumber()
  products: number;

  @IsNotEmpty()
  @IsNumber()
  percentage: number;
}
