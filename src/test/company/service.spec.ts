import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../../modules/company/service';
import { PrismaService } from '../../prisma/service';

/**
 * Unit tests for the CompanyService.
 */
describe('CompanyService', () => {
  let companyService: CompanyService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new company and return the created company data', async () => {
      const data = {
        companyName: 'Test Company',
        users: 10,
        products: 5,
        percentage: 50,
      };
      const userId = '1';
      const newCompany = {
        id: '1',
        ...data,
        owner_id: userId,
        createdAt: new Date(),
      };

      mockPrismaService.company.create.mockResolvedValue(newCompany);

      const result = await companyService.create(data, userId);

      expect(result).toEqual({
        message: 'Comapny created successfully',
        data: { Company: newCompany },
      });
      expect(prismaService.company.create).toHaveBeenCalledWith({
        data: {
          company_name: data.companyName,
          users: data.users,
          products: data.products,
          percentage: data.percentage,
          owner_id: userId,
        },
      });
    });
  });

  describe('fetchRecentInput', () => {
    it('should fetch the 5 most recent company inputs for the given user ID', async () => {
      const userId = '1';
      const recentInputs = [
        { id: '1', company_name: 'Company A', createdAt: new Date() },
        { id: '2', company_name: 'Company B', createdAt: new Date() },
        { id: '3', company_name: 'Company C', createdAt: new Date() },
        { id: '4', company_name: 'Company D', createdAt: new Date() },
        { id: '5', company_name: 'Company E', createdAt: new Date() },
      ];

      mockPrismaService.company.findMany.mockResolvedValue(recentInputs);

      const result = await companyService.fetchRecentInput(userId);

      expect(result).toEqual({
        message: 'Recent inputs fetched successfully',
        data: { recentInputs },
      });
      expect(prismaService.company.findMany).toHaveBeenCalledWith({
        where: { owner_id: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    });
  });
});
