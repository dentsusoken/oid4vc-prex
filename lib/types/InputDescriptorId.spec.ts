import { describe, expect, it } from 'vitest';
import {
  InputDescriptorId,
  inputDescriptorIdSchema,
} from './InputDescriptorId';

describe('InputDescriptorId', () => {
  describe('constructor', () => {
    it('should create instance', () => {
      const id = new InputDescriptorId('123');

      expect(id).toBeInstanceOf(InputDescriptorId);
      expect(id.value).toBe('123');
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const id = new InputDescriptorId('123');

      expect(id.toJSON()).toBe('123');
      expect(JSON.stringify(id)).toBe('"123"');
    });
  });
  describe('inputDescriptorIdSchema', () => {
    it('should validate', () => {
      expect(() => inputDescriptorIdSchema.parse('abc123')).not.toThrow();
      expect(() => inputDescriptorIdSchema.parse('a')).not.toThrow();
    });
  });
});
