import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto';
import { CompanyService } from './service';
import { Role, Roles } from 'src/decorators/role';
import { RequestWithUser } from './interface';

@Controller('/api/company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Role(Roles.UserA)
  @Post()
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: RequestWithUser,
  ) {
    return await this.companyService.create(createCompanyDto, req.user.sub);
  }

  /**
   * Fetches the recent inputs for the specified user.
   *
   * @param userId - The ID of the user to fetch recent inputs for.
   * @returns The recent inputs for the specified user.
   */
  @Role(Roles.UserB)
  @Get('recent-inputs/:userId')
  async getRecentInputs(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return await this.companyService.fetchRecentInput(userId);
  }
}
