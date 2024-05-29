import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Represents the data required to create a new company.
 */
export class CreateCompanyDto {
  @IsNotEmpty()
  companyName: string;

  @IsNumber()
  users: number;

  @IsNumber()
  products: number;

  @IsNumber()
  percentage: number;
}
