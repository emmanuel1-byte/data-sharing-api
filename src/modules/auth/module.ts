import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/module';
import { AuthService } from './service';
import { AuthController } from './controller';
import { AuthGuard } from '../../guards/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * The AuthModule is a NestJS module that provides authentication-related functionality for the application.
 * It imports the PrismaModule and JwtModule, and provides the AuthService, AuthGuard, and Logger.
 * The JwtModule is registered asynchronously, using the ConfigService to retrieve the JWT secret and expiration time.
 * The AuthService and AuthGuard are exported from the module, allowing them to be used by other parts of the application.
 */
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
