import { describe, expect, it } from 'vitest';
import { filterSchema, Filter } from './Filter';
import { JSONSchema7, validate } from 'json-schema';

describe('Filter', () => {
  describe('filterSchema', () => {
    it('should be an object', () => {
      const jsonSchema: JSONSchema7 = {
        type: 'string',
        const: 'https://eu.com/claims/DriversLicense.json',
      };

      const result = filterSchema.safeParse(jsonSchema);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(jsonSchema);
    });
  });
  describe('constructor', () => {
    it('should create a new Filter instance', () => {
      const jsonSchema: JSONSchema7 = {
        type: 'string',
        const: 'https://eu.com/claims/DriversLicense.json',
      };

      const filter = new Filter(jsonSchema);
      expect(filter.value).toEqual(jsonSchema);
    });
  });
  describe('toJSON', () => {
    it('should return the JSONSchema value of the Filter class', () => {
      const jsonSchema: JSONSchema7 = {
        type: 'string',
        const: 'https://eu.com/claims/DriversLicense.json',
      };

      const filter = new Filter(jsonSchema);
      expect(filter.toJSON()).toEqual(jsonSchema);
    });
  });
  describe('fromJSON', () => {
    it('should create a Filter instance from a JSON', () => {
      const jsonSchema: JSONSchema7 = {
        type: 'string',
        const: 'https://eu.com/claims/DriversLicense.json',
      };

      const filter = Filter.fromJSON(jsonSchema);
      expect(filter.value).toEqual(jsonSchema);
    });
  });
});
