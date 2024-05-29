import { Injectable } from '@nestjs/common';
import { Company } from './interface';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService) {}

  async create(data: Company, userId: string) {
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
      message: 'Comapny created succesfully',
      data: { Company: newComapny },
    };
  }

  /**
   * Fetches the 5 most recent company inputs for the given user ID.
   *
   * @param userId - The ID of the user whose recent company inputs should be fetched.
   * @returns An object containing a success message and the array of recent company inputs.
   */
  async fetchRecentInput(userId: string) {
    const recentInputs = await this.prismaService.company.findMany({
      where: {
        owner_id: userId,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return {
      message: 'Recent inputs fetched succesfully',
      data: { recentInputs },
    };
  }
}
