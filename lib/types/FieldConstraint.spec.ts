import { describe, expect, it } from 'vitest';
import {
  pathSchema,
  fieldConstraintSchema,
  FieldConstraint,
} from './FieldConstraint';
import { Id } from './Id';
import { Name } from './Name';
import { Purpose } from './Purpose';
import { Filter } from './Filter';

describe('FieldConstraint', () => {
  describe('pathSchema', () => {
    it('should be a non-empty set of JSON paths', () => {
      const validPaths = ['$.a', '$.b'];
      const invalidPaths = ['', '$.a', 123];

      expect(pathSchema.safeParse(validPaths)).toEqual({
        success: true,
        data: validPaths,
      });
      expect(pathSchema.safeParse(invalidPaths).success).toBe(false);
    });
  });
  describe('fieldConstraintSchema', () => {
    it('should be a valid FieldConstraint', () => {
      const validFieldConstraint = {
        path: ['$.a'],
        id: '123',
        name: 'name',
        purpose: 'purpose',
        filter: { type: 'string' },
        optional: true,
        intent_to_retain: true,
      };
      const invalidFieldConstraint = {
        path: ['.a'],
        id: '123',
        name: 'name',
        purpose: 'purpose',
        filter: { type: 'string' },
        optional: 'true',
        intent_to_retain: true,
      };

      expect(fieldConstraintSchema.safeParse(validFieldConstraint)).toEqual({
        success: true,
        data: validFieldConstraint,
      });

      expect(
        fieldConstraintSchema.safeParse(invalidFieldConstraint).success
      ).toBe(false);
    });
  });
  describe('constructor', () => {
    it('should create a new FieldConstraint instance', () => {
      const fieldConstraint = new FieldConstraint(
        ['$.a'],
        new Id('123'),
        new Name('name'),
        new Purpose('purpose'),
        new Filter({ type: 'string' }),
        true,
        true
      );
      expect(fieldConstraint).toBeInstanceOf(FieldConstraint);
    });
  });
  describe('fromJSON', () => {
    it('should create a FieldConstraint instance from a JSON object', () => {
      const fieldConstraint = FieldConstraint.fromJSON({
        path: ['$.a'],
        id: '123',
        name: 'name',
        purpose: 'purpose',
        filter: { type: 'string' },
        optional: true,
        intent_to_retain: true,
      });
      expect(fieldConstraint).toBeInstanceOf(FieldConstraint);
      expect(fieldConstraint.paths).toStrictEqual(['$.a']);
      expect(fieldConstraint.id).toBeInstanceOf(Id);
      expect(fieldConstraint.id?.value).toStrictEqual('123');
      expect(fieldConstraint.name).toBeInstanceOf(Name);
      expect(fieldConstraint.name?.value).toStrictEqual('name');
      expect(fieldConstraint.purpose).toBeInstanceOf(Purpose);
      expect(fieldConstraint.purpose?.value).toStrictEqual('purpose');
      expect(fieldConstraint.filter).toBeInstanceOf(Filter);
      expect(fieldConstraint.filter?.value).toStrictEqual({ type: 'string' });
      expect(fieldConstraint.optional).toStrictEqual(true);
      expect(fieldConstraint.intentToRetain).toStrictEqual(true);
    });
  });
  describe('toJSON', () => {
    it('should return a JSON representation of the FieldConstraint', () => {
      const fieldConstraint = new FieldConstraint(
        ['$.a'],
        new Id('123'),
        new Name('name'),
        new Purpose('purpose'),
        new Filter({ type: 'string' }),
        true,
        true
      );
      expect(fieldConstraint.toJSON()).toStrictEqual({
        path: ['$.a'],
        id: '123',
        name: 'name',
        purpose: 'purpose',
        filter: { type: 'string' },
        optional: true,
        intent_to_retain: true,
      });
    });
  });
});
