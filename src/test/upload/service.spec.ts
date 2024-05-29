import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from '../../modules/upload/service';
import { PrismaService } from '../../prisma/service';

/**
 * Unit tests for the UploadService.
 */
describe('UploadService', () => {
  let uploadService: UploadService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    image: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    uploadService = module.get<UploadService>(UploadService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should upload an image and return success message with new image data', async () => {
      const imageUrl = 'http://example.com/image.png';
      const userId = 'user-1';
      const newImage = {
        id: 'image-1',
        image_url: imageUrl,
        user_id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.image, 'create').mockResolvedValue(newImage);

      const result = await uploadService.create(imageUrl, userId);
      expect(result).toEqual({
        message: 'Image uploaded successfully',
        data: { Image: newImage },
      });
      expect(prismaService.image.create).toHaveBeenCalledWith({
        data: { image_url: imageUrl, user_id: userId },
      });
    });
  });

  describe('fetchImages', () => {
    it('should fetch images and return success message with images data', async () => {
      const userId = 'user-1';
      const images = [
        {
          id: 'image-1',
          image_url: 'http://example.com/image1.png',
          user_id: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'image-2',
          image_url: 'http://example.com/image2.png',
          user_id: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prismaService.image, 'findMany').mockResolvedValue(images);

      const result = await uploadService.fetchImages(userId);
      expect(result).toEqual({
        message: 'Images fetched successfully',
        data: { images },
      });
      expect(prismaService.image.findMany).toHaveBeenCalledWith({
        where: { user_id: userId },
      });
    });
  });
});
