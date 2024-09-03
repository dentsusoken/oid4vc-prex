import { describe, expect, it } from 'vitest';
import { InputDescriptor, inputDescriptorSchema } from './InputDescriptor';
import { InputDescriptorId } from './InputDescriptorId';
import { Constraints } from './Constraints';

describe('InputDescriptor', () => {
  describe('constructor', () => {
    it('should create instance', () => {
      const inputDescriptor = new InputDescriptor(
        new InputDescriptorId('123'),
        undefined,
        undefined,
        undefined,
        Constraints.LimitDisclosure.PREFERRED,
        undefined
      );
      expect(inputDescriptor).toBeInstanceOf(InputDescriptor);
      expect(inputDescriptor.id.value).toBe('123');
      expect(inputDescriptor.constraints).toBe(
        Constraints.LimitDisclosure.PREFERRED
      );
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const inputDescriptor = new InputDescriptor(
        new InputDescriptorId('123'),
        undefined,
        undefined,
        undefined,
        Constraints.LimitDisclosure.PREFERRED,
        undefined
      );

      expect(inputDescriptor.toJSON().id).toBe('123');
      expect(JSON.stringify(inputDescriptor)).toBe(
        '{"id":"123","constraints":{"limit_disclosure":"preferred"}}'
      );
    });
  });
  describe('inputDescriptorSchema', () => {
    it('should validate', () => {
      expect(() =>
        inputDescriptorSchema.parse({
          id: 'abc123',
          constraints: {
            limit_disclosure: 'preferred',
          },
        })
      ).not.toThrow();
    });
    it('should throw', () => {
      expect(() =>
        inputDescriptorSchema.parse({
          id: 'abc123',
          constraints: {
            limit_disclosure: 'invalid',
          },
        })
      ).toThrow();
    });
  });
});
