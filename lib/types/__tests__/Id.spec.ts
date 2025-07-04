import { describe, expect, it } from 'vitest';
import { Id, idSchema } from '../Id';

describe('Id', () => {
  describe('constructor', () => {
    it('should create instance', () => {
      const id = new Id('123');

      expect(id).toBeInstanceOf(Id);
      expect(id.value).toBe('123');
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const id = new Id('123');

      expect(id.toJSON()).toBe('123');
      expect(JSON.stringify(id)).toBe('"123"');
    });
  });
  describe('idSchema', () => {
    it('should validate', () => {
      expect(() => idSchema.parse('abc123')).not.toThrow();
      expect(() => idSchema.parse('a')).not.toThrow();
    });
  });
});
