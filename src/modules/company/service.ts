import { Injectable } from '@nestjs/common';
import { Company } from './interface';
import { PrismaService } from '../../prisma/service';

@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Creates a new company in the database.
   *
   * @param data - The company data to create.
   * @param userId - The ID of the user creating the company.
   * @returns An object containing a success message and the created company data.
   */
  async create(data: Company, userId: string): Promise<any> {
    const newComapny = await this.prismaService.company.create({
      data: {
        company_name: data.companyName,
        users: data.users,
        products: data.products,
        percentage: data.percentage,
        owner_id: userId,
      },
    });
    return {
      message: 'Comapny created successfully',
      data: { Company: newComapny },
    };
  }

  /**
   * Fetches the 5 most recent company inputs for the given user ID.
   *
   * @param userId - The ID of the user whose recent company inputs should be fetched.
   * @returns An object containing a success message and the array of recent company inputs.
   */
  async fetchRecentInput(userId: string): Promise<any> {
    const recentInputs = await this.prismaService.company.findMany({
      where: {
        owner_id: userId,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return {
      message: 'Recent inputs fetched successfully',
      data: { recentInputs },
    };
  }
}
