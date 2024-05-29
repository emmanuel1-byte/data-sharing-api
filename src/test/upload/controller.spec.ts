import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../../modules/upload/controller';
import { UploadService } from '../../modules/upload/service';
import { RoleGuard } from '../../guards/role';
import { RequestWithUser } from 'src/modules/auth/interface';

/**
 * Unit tests for the UploadController.
 */
describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;

  const mockUploadService = {
    create: jest.fn(),
    fetchImages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: mockUploadService }],
    })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload an image for a given user', async () => {
      const mockFile = {
        path: 'mock/path/to/file.png',
      } as Express.Multer.File;
      const userId = 'mock-uuid';
      mockUploadService.create.mockResolvedValue({ success: true });

      const result = await controller.uploadImage(mockFile, userId);

      expect(result).toEqual({ success: true });
      expect(uploadService.create).toHaveBeenCalledWith(mockFile.path, userId);
    });
  });

  describe('viewImages', () => {
    it('should fetch images for the authenticated user', async () => {
      const mockRequest = {
        user: { sub: 'mock-user-id' },
      } as RequestWithUser;
      mockUploadService.fetchImages.mockResolvedValue([
        { id: '1', path: 'mock/path/to/image.png' },
      ]);

      const result = await controller.viewImages(mockRequest);

      expect(result).toEqual([{ id: '1', path: 'mock/path/to/image.png' }]);
      expect(uploadService.fetchImages).toHaveBeenCalledWith('mock-user-id');
    });

    it('should throw an error if user is not authenticated', async () => {
      const mockRequest = {
        user: null,
      } as unknown as RequestWithUser;

      await expect(controller.viewImages(mockRequest)).rejects.toThrow();
    });
  });
});
