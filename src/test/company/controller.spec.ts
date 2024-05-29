import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from '../../modules/company/controller';
import { CompanyService } from '../../modules/company/service';
import { CreateCompanyDto } from '../../modules/company/dto';
import { RequestWithUser } from '../../modules/auth/interface';
import { RoleGuard } from '../../guards/role';
import { Reflector } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';

/**
 * Unit tests for the CompanyController.
 */
describe('CompanyController', () => {
  let companyController: CompanyController;
  let companyService: CompanyService;

  const mockCompanyService = {
    create: jest.fn(),
    fetchRecentInput: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        Reflector,
      ],
    })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    companyController = module.get<CompanyController>(CompanyController);
    companyService = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCompany', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        companyName: 'Test Company',
        users: 10,
        products: 5,
        percentage: 50,
      };
      const req: RequestWithUser = { user: { sub: 'user-id' } } as any;
      const result = {
        id: 'company-id',
        company_name: 'Test Company',
        users: 10,
        products: 5,
        percentage: 50,
      };

      mockCompanyService.create.mockResolvedValue(result);

      expect(
        await companyController.createCompany(createCompanyDto, req),
      ).toEqual(result);
      expect(companyService.create).toHaveBeenCalledWith(
        createCompanyDto,
        'user-id',
      );
    });
  });

  describe('getRecentInputs', () => {
    it('should return recent inputs for a user', async () => {
      const userId = 'user-id';
      const recentInputs = [
        {
          id: 'company-id',
          company_name: 'Test Company',
          users: 10,
          products: 5,
          percentage: 50,
          owner_id: userId,
        },
      ];

      mockCompanyService.fetchRecentInput.mockResolvedValue(recentInputs);

      expect(await companyController.getRecentInputs(userId)).toEqual(
        recentInputs,
      );
      expect(companyService.fetchRecentInput).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'user-id';

      mockCompanyService.fetchRecentInput.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(companyController.getRecentInputs(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(companyService.fetchRecentInput).toHaveBeenCalledWith(userId);
    });
  });
});
