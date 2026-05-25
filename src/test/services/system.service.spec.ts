import { Test, TestingModule } from '@nestjs/testing';
import { SystemService } from '../../app/services/system.service';
import { SystemRepo } from '../../app/repositories/system.repo';
import { BaseSearchDto } from '../../app/dto/base-search.dto';

describe('SystemService', () => {
  let service: SystemService;
  let repo: SystemRepo;

  const mockSystemRepo = {
    findData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemService,
        {
          provide: SystemRepo,
          useValue: mockSystemRepo,
        },
      ],
    }).compile();

    service = module.get<SystemService>(SystemService);
    repo = module.get<SystemRepo>(SystemRepo);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should call systemRepo.findData with the provided body and return the result', async () => {
      const mockSearchDto: BaseSearchDto = {
        page: 1,
        limit: 10,
      } as any;

      const expectedResponse = {
        data: [
          { id: 1, name: 'System Setting A', value: 'Active' }
        ],
        totalItem: 1,
      };

      mockSystemRepo.findData.mockResolvedValue(expectedResponse);

      const result = await service.search(mockSearchDto);

      expect(repo.findData).toHaveBeenCalledWith(mockSearchDto);
      expect(repo.findData).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });
  });
});
