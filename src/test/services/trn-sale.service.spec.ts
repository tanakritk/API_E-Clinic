import { Test, TestingModule } from '@nestjs/testing';
import { SaleService } from '../../app/services/trn-sale.service';
import { SaleRepo } from '../../app/repositories/trn-sale.repo';
import { SaleItemRepo } from '../../app/repositories/trn-sale-item.repo';
import { SaleScheduleRepo } from '../../app/repositories/trn-sale-schedule.repo';
import { Connection } from 'typeorm';
import { SearchSaleDto } from '../../app/dto/trn-sale.dto';

describe('SaleService', () => {
  let service: SaleService;
  let saleRepo: SaleRepo;

  const mockSaleRepo = {
    findConditionAndCount: jest.fn(),
  };

  const mockSaleItemRepo = {};
  const mockSaleScheduleRepo = {};
  
  const mockConnection = {
    createQueryRunner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        { provide: SaleRepo, useValue: mockSaleRepo },
        { provide: SaleItemRepo, useValue: mockSaleItemRepo },
        { provide: SaleScheduleRepo, useValue: mockSaleScheduleRepo },
        { provide: Connection, useValue: mockConnection },
      ],
    }).compile();

    service = module.get<SaleService>(SaleService);
    saleRepo = module.get<SaleRepo>(SaleRepo);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ควรตรวจสอบว่า Service ถูกสร้างขึ้นมาสำเร็จ', () => {
    expect(service).toBeDefined();
  });

  describe('search (การค้นหาข้อมูลใบขาย)', () => {
    it('ควรเรียกใช้ saleRepo.findConditionAndCount และคืนค่ากลับออกมาในรูปแบบที่ถูกต้อง', async () => {
      const mockSearchDto: SearchSaleDto = {
        page: 1,
        limit: 10,
        advanceFilter: {
          branchId: 5,
          customerId: 12,
        },
      } as any;

      const mockDbResult = [
        [
          { id: 1, receiptNo: 'REP0000000001', grandTotal: 500 },
          { id: 2, receiptNo: 'REP0000000002', grandTotal: 1200 },
        ],
        2,
      ];

      mockSaleRepo.findConditionAndCount.mockResolvedValue(mockDbResult);

      const result = await service.search(mockSearchDto);

      expect(saleRepo.findConditionAndCount).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: mockDbResult[0],
        totalItem: mockDbResult[1],
      });
    });
  });
});
