import { describe, expect, it } from 'vitest';
import { NonEmptySet, createNonEmptySetSchema } from './NonEmptySet';
import { z } from 'zod';

describe('NonEmptySet', () => {
  describe('createNonEmptySetSchema', () => {
    it('should return non-empty set schema', () => {
      const nonEmptySetSchema = createNonEmptySetSchema(z.string());
      expect(nonEmptySetSchema.parse(['abc123', 'def456'])).toEqual([
        'abc123',
        'def456',
      ]);
      expect(nonEmptySetSchema.parse(['a'])).toEqual(['a']);
    });
    it('should throw ZodError', () => {
      const nonEmptySetSchema = createNonEmptySetSchema(z.string());
      expect(() => nonEmptySetSchema.parse('')).toThrowError();
      expect(() => nonEmptySetSchema.parse(123)).toThrowError();
    });
  });
  describe('NonEmptySet', () => {
    it('should be a type alias for z.ZodArray', () => {
      const itemSchema = z.string();
      const nonEmptySetSchema = createNonEmptySetSchema(itemSchema);
      const nonEmptySet: NonEmptySet<z.infer<typeof itemSchema>> =
        nonEmptySetSchema.parse(['abc123', 'def456']);
      expect(nonEmptySet).toEqual(['abc123', 'def456']);
    });
  });
});
