import { Module } from '@nestjs/common';
import { CompanyService } from './service';
import { CompanyController } from './controller';
import { AuthModule } from '../auth/module';
import { PrismaModule } from 'prisma/module';

/**
 * The `CompanyModule` is a module that provides the necessary services and controllers for managing company-related functionality in the application.
 * It includes the `CompanyService` and `PrismaService` providers, as well as the `CompanyController` controller.
 */
@Module({
  imports: [AuthModule, PrismaModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
