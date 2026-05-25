import { Test, TestingModule } from '@nestjs/testing';
import { SystemController } from '../../app/controllers/system.controller';
import { SystemService } from '../../app/services/system.service';
import { BaseSearchDto } from '../../app/dto/base-search.dto';
import { PaginationVm } from '../../app/view-model/pagination.vm';
import { InternalServerErrorException } from '@nestjs/common';

describe('SystemController', () => {
  let controller: SystemController;
  let service: SystemService;

  const mockSystemService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [
        {
          provide: SystemService,
          useValue: mockSystemService,
        },
      ],
    }).compile();

    controller = module.get<SystemController>(SystemController);
    service = module.get<SystemService>(SystemService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should call systemService.search, wrap it with PaginationVm, and return the result', async () => {
      const mockBody: BaseSearchDto = {
        page: 1,
        limit: 10,
      } as any;

      const mockServiceResult = {
        data: [{ id: 1, name: 'System Info' }],
        totalItem: 1,
      };

      mockSystemService.search.mockResolvedValue(mockServiceResult);

      const result = await controller.search(mockBody);

      expect(service.search).toHaveBeenCalledWith(mockBody);
      expect(service.search).toHaveBeenCalledTimes(1);

      expect(result).toBeDefined();
      expect(result.data).toEqual([
        { id: 1, name: 'System Info', no: 1 }
      ]);
      expect(result.paginationData.page).toBe(1);
      expect(result.paginationData.limit).toBe(10);
      expect(result.paginationData.totalItems).toBe(1);
    });

    it('should throw InternalServerErrorException if service.search fails', async () => {
      const mockBody: BaseSearchDto = {
        page: 1,
        limit: 10,
      } as any;

      const mockError = new Error('Database connection failed');
      mockSystemService.search.mockRejectedValue(mockError);

      await expect(controller.search(mockBody)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
