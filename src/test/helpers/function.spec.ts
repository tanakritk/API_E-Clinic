import { booleanTransformer } from '../../helpers/function';

describe('booleanTransformer', () => {
  describe('to', () => {
    it('should return null when value is null or undefined', () => {
      expect(booleanTransformer.to(null)).toBeNull();
      expect(booleanTransformer.to(undefined)).toBeNull();
    });

    it('should return 1 when value is true', () => {
      expect(booleanTransformer.to(true)).toBe(1);
    });

    it('should return 0 when value is false', () => {
      expect(booleanTransformer.to(false)).toBe(0);
    });
  });

  describe('from', () => {
    it('should return null when value is null or undefined', () => {
      expect(booleanTransformer.from(null)).toBeNull();
      expect(booleanTransformer.from(undefined)).toBeNull();
    });

    it('should return true if value is a Buffer containing 1', () => {
      const buf = Buffer.from([1]);
      expect(booleanTransformer.from(buf)).toBe(true);
    });

    it('should return false if value is a Buffer containing 0', () => {
      const buf = Buffer.from([0]);
      expect(booleanTransformer.from(buf)).toBe(false);
    });

    it('should return true if value is 1 or true', () => {
      expect(booleanTransformer.from(1)).toBe(true);
      expect(booleanTransformer.from(true)).toBe(true);
    });

    it('should return false if value is 0, false, or any other value', () => {
      expect(booleanTransformer.from(0)).toBe(false);
      expect(booleanTransformer.from(false)).toBe(false);
      expect(booleanTransformer.from('some-string')).toBe(false);
    });
  });
});
