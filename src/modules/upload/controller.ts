import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role, Roles } from 'src/decorators/role';
import { RequestWithUser } from '../company/interface';

@Controller('api/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  /**
   * Uploads an image file for the specified user.
   *
   * @param file - The uploaded file, which must be a PNG, JPG, or JPEG image and less than 5MB in size.
   * @param userId - The ID of the user to associate the uploaded image with.
   * @returns The result of creating the image upload.
   */
  @Role(Roles.UserB)
  @Post('/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(png|jpg|jpeg)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return await this.uploadService.create(file.path, userId);
  }

  /**
   * Fetches images for the authenticated user.
   *
   * @param req - The request object containing the authenticated user's information.
   * @returns The images for the authenticated user.
   */

  @Role(Roles.UserA)
  @Get('/')
  async viewImages(@Req() req: RequestWithUser) {
    return await this.uploadService.fetchImages(req.user.sub);
  }
}
