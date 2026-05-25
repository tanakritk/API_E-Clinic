import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from '../../app/controllers/trn-sale.controller';
import { SaleService } from '../../app/services/trn-sale.service';
import { SearchSaleDto, CreateSaleDto } from '../../app/dto/trn-sale.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('SaleController', () => {
  let controller: SaleController;
  let service: SaleService;

  const mockSaleService = {
    search: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: mockSaleService,
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get<SaleService>(SaleService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ควรตรวจสอบว่า Controller ถูกสร้างขึ้นมาสำเร็จ', () => {
    expect(controller).toBeDefined();
  });

  describe('search (ค้นหารายการใบขายผ่าน API)', () => {
    it('ควรเรียกใช้ saleService.search และห่อหุ้มผลลัพธ์ด้วย Pagination Data', async () => {
      const mockSearchDto: SearchSaleDto = {
        page: 1,
        limit: 10,
      } as any;

      const mockServiceResult = {
        data: [{ id: 1, receiptNo: 'REP00001', grandTotal: 300 }],
        totalItem: 1,
      };

      mockSaleService.search.mockResolvedValue(mockServiceResult);

      const result = await controller.search(mockSearchDto);

      expect(service.search).toHaveBeenCalledWith(mockSearchDto);
      expect(result).toBeDefined();
      expect(result.data).toEqual([
        { id: 1, receiptNo: 'REP00001', grandTotal: 300, no: 1 }
      ]);
      expect(result.paginationData.page).toBe(1);
      expect(result.paginationData.limit).toBe(10);
      expect(result.paginationData.totalItems).toBe(1);
    });

    it('ควรส่งข้อผิดพลาด InternalServerErrorException หาก Service ทำงานล้มเหลว', async () => {
      const mockSearchDto: SearchSaleDto = { page: 1, limit: 10 } as any;
      mockSaleService.search.mockRejectedValue(new Error('Connection timeout'));

      await expect(controller.search(mockSearchDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create (สร้างใบขายใหม่ผ่าน API)', () => {
    it('ควรสร้างใบขายสำเร็จและส่งผลตอบกลับกลับมาในรูปแบบ ResponseDataVm', async () => {
      const mockCreateDto: CreateSaleDto = {
        grandTotal: 1000,
        mas_branch: 1,
        mas_customer: 2,
      } as any;

      const mockReq = {
        user: { id: 99 },
      };

      const mockCreatedResult = {
        id: 10,
        receiptNo: 'REP0000000010',
        grandTotal: 1000,
        DeletedDate: null,
      };

      mockSaleService.create.mockResolvedValue(mockCreatedResult);

      const result = await controller.create(mockCreateDto, mockReq);

      expect(service.create).toHaveBeenCalledWith(mockCreateDto, 99);
      expect(result).toBeDefined();
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('OK');
      expect(result.data).toEqual({
        id: 10,
        receiptNo: 'REP0000000010',
        grandTotal: 1000,
      });
    });
  });
});
