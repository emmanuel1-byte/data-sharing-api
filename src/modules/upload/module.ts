import { Module } from '@nestjs/common';
import { UploadService } from './service';
import { UploadController } from './controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'prisma/module';

/**
 * This module configures the Multer file upload middleware and provides the UploadService and PrismaService providers.
 * The Multer middleware is registered asynchronously with a factory function that sets the destination directory for uploaded files to './uploads'.
 * The UploadService and PrismaService providers are made available to the controllers in this module.
 */
@Module({
  imports: [
    PrismaModule,
    MulterModule.registerAsync({
      useFactory: () => ({ dest: './uploads' }),
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
