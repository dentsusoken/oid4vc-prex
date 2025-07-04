import { describe, expect, it } from 'vitest';
import { Name, nameSchema } from '../Name';

describe('Name', () => {
  describe('constructor', () => {
    it('should create instance', () => {
      const name = new Name('123');

      expect(name).toBeInstanceOf(Name);
      expect(name.value).toBe('123');
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const name = new Name('123');

      expect(name.toJSON()).toBe('123');
      expect(JSON.stringify(name)).toBe('"123"');
    });
  });
  describe('nameSchema', () => {
    it('should validate value', () => {
      expect(nameSchema.parse('123')).toBe('123');
      expect(nameSchema.parse('a')).toBe('a');
    });
    it('should throw error if value is invalid', () => {
      expect(() => nameSchema.parse('')).toThrow(
        'String must contain at least 1 character(s)'
      );
      expect(() => nameSchema.parse(123)).toThrow(
        'Expected string, received number'
      );
    });
  });
});
