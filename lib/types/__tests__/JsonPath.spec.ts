import { describe, expect, it, vi } from 'vitest';
import { JsonPath, jsonPathSchema } from '../JsonPath';
import { JsonPathOps } from '../../JsonPathOps';

describe('JsonPath', () => {
  describe('fromString', () => {
    it('should return JsonPath instance', () => {
      const jsonPath = JsonPath.fromString('$.abc123');

      expect(jsonPath).toBeInstanceOf(JsonPath);
      expect(jsonPath!.value).toBe('$.abc123');
    });
    it('should return undefined', () => {
      const spy = vi.spyOn(JsonPathOps, 'isValid').mockReturnValue(false);
      const jsonPath = JsonPath.fromString('abc123');
      spy.mockRestore();

      expect(jsonPath).toBeUndefined();
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const jsonPath = JsonPath.fromString('$.abc123');

      expect(jsonPath!.toJSON()).toBe('$.abc123');
      expect(JSON.stringify(jsonPath)).toBe('"$.abc123"');
    });
  });
  describe('jsonPathSchema', () => {
    it('should validate value', () => {
      expect(jsonPathSchema.parse('$.abc123')).toBe('$.abc123');
      expect(jsonPathSchema.parse('$[0]')).toBe('$[0]');
    });
    it('should throw error if value is invalid', () => {
      const spy = vi.spyOn(JsonPathOps, 'isValid').mockReturnValue(false);
      expect(() => jsonPathSchema.parse('abc123')).toThrow();
      expect(() => jsonPathSchema.parse(123)).toThrow(
        'Expected string, received number'
      );
      spy.mockRestore();
    });
  });
});
