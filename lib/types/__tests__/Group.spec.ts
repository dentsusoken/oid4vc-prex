import { describe, expect, it } from 'vitest';
import { Group, groupSchema } from '../Group';

describe('Group', () => {
  describe('constructor', () => {
    it('should create instance', () => {
      const id = new Group('123');

      expect(id).toBeInstanceOf(Group);
      expect(id.value).toBe('123');
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const id = new Group('123');

      expect(id.toJSON()).toBe('123');
      expect(JSON.stringify(id)).toBe('"123"');
    });
  });
  describe('groupSchema', () => {
    it('should validate', () => {
      expect(() => groupSchema.parse('abc123')).not.toThrow();
      expect(() => groupSchema.parse('a')).not.toThrow();
    });
  });
});
