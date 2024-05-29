import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service';

@Injectable()
export class UploadService {
  constructor(private prismaService: PrismaService) {}

  /**
   * Uploads an image to the database and returns a success message with the new image data.
   *
   * @param imageUrl - The URL of the image to be uploaded.
   * @param userId - The ID of the user uploading the image.
   * @returns An object with a success message and the new image data.
   */
  async create(imageUrl: string, userId: string) {
    const newImage = await this.prismaService.image.create({
      data: {
        image_url: imageUrl,
        user_id: userId,
      },
    });

    return { message: 'Image uploaded succesfully', data: { Image: newImage } };
  }

  /**
   * Fetches all images associated with the provided user ID.
   *
   * @param userId - The ID of the user whose images should be fetched.
   * @returns An object containing a success message and the fetched images.
   */
  async fetchImages(userId: string) {
    const images = await this.prismaService.image.findMany({
      where: {
        user_id: userId,
      },
    });
    return { message: 'Images fetched succesfully', data: { images } };
  }
}
