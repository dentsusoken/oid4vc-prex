import { describe, expect, it } from 'vitest';
import { JsonPath, jsonPathSchema } from './JsonPath';

describe('JsonPath', () => {
  describe('fromString', () => {
    it('should return JsonPath instance', () => {
      const jsonPath = JsonPath.fromString('$.abc123');

      expect(jsonPath).toBeInstanceOf(JsonPath);
      expect(jsonPath!.value).toBe('$.abc123');
    });
    it('should return undefined', () => {
      const jsonPath = JsonPath.fromString('abc123');

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
      expect(() => jsonPathSchema.parse('abc123')).toThrow();
      expect(() => jsonPathSchema.parse(123)).toThrow(
        'Expected string, received number'
      );
    });
  });
});
