import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/module';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './modules/company/module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './guards/role';
import { UploadModule } from './modules/upload/module';
import { HealthController } from './healh.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompanyModule,
    UploadModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RoleGuard }],
  controllers: [HealthController],
})
export class AppModule {}
