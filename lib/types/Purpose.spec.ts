import { describe, expect, it } from 'vitest';
import { Purpose, purposeSchema } from './Purpose';
describe('Purpose', () => {
  describe('constructor', () => {
    it('should create instance', () => {
      const purpose = new Purpose('123');

      expect(purpose).toBeInstanceOf(Purpose);
      expect(purpose.value).toBe('123');
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const purpose = new Purpose('123');

      expect(purpose.toJSON()).toBe('123');
      expect(JSON.stringify(purpose)).toBe('"123"');
    });
  });
  describe('purposeSchema', () => {
    it('should validate value', () => {
      expect(purposeSchema.parse('123')).toBe('123');
      expect(purposeSchema.parse('a')).toBe('a');
    });
    it('should throw error if value is invalid', () => {
      expect(() => purposeSchema.parse('')).toThrow(
        'String must contain at least 1 character(s)'
      );
      expect(() => purposeSchema.parse(123)).toThrow(
        'Expected string, received number'
      );
    });
  });
});
