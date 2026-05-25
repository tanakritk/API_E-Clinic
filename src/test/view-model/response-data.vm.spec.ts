import { ResponseDataVm } from '../../app/view-model/response-data.vm';
import { HttpStatus } from '@nestjs/common';

describe('ResponseDataVm', () => {
  describe('convertToVm', () => {
    it('ควรแปลงข้อมูลและคัดกรองฟิลด์ DeletedDate ออกไปหากข้อมูลไม่เป็น null', () => {
      const mockRawData = {
        id: 1,
        receiptNo: 'REP0001',
        grandTotal: 1000,
        DeletedDate: new Date('2026-05-20'),
      };

      const result = ResponseDataVm.convertToVm(mockRawData);

      expect(result).toBeDefined();
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toBe('OK');
      
      expect(result.data).toEqual({
        id: 1,
        receiptNo: 'REP0001',
        grandTotal: 1000,
      });
      expect(result.data.DeletedDate).toBeUndefined();
    });

    it('ควรส่งข้อมูลตอบกลับแบบ No Data หากส่งค่า null เข้ามาใช้งาน', () => {
      const result = ResponseDataVm.convertToVm(null);

      expect(result).toBeDefined();
      expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(result.message).toBe('No Data');
      expect(result.data).toBeNull();
    });
  });
});
