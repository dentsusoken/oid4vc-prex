import { describe, expect, it } from 'vitest';
import { From, fromGroupSchema, fromNestedSchema, fromSchema } from '../From';
import { Group } from '../Group';

describe('From', () => {
  describe('fromGroupSchema', () => {
    it('should return true for valid input', () => {
      expect(fromGroupSchema.safeParse('group').success).toBe(true);
    });

    it('should return false for invalid input', () => {
      expect(fromGroupSchema.safeParse({ from: {} }).success).toBe(false);
    });
  });
  describe('fromNestedSchema', () => {
    it('should return true for valid input', () => {
      expect(
        fromNestedSchema.safeParse([
          {
            from: 'group',
            rule: 'all',
          },
        ]).success
      ).toBe(true);
    });

    it('should return false for invalid input', () => {
      expect(fromNestedSchema.safeParse({ from_nested: {} }).success).toBe(
        false
      );
    });
  });
  describe('fromSchema', () => {
    it('should return true for valid input', () => {
      expect(
        fromSchema.safeParse({
          from: 'group',
        }).success
      ).toBe(true);
    });
    it('should return false for invalid input', () => {
      expect(
        fromSchema.safeParse({ from: 'group', from_nested: {} }).success
      ).toBe(false);
    });
  });
  describe('fromJSON', () => {
    it('should throw an error if from and from_nested are not defined', () => {
      expect(() => From.fromJSON({})).toThrow(
        'From or FromNested must be defined'
      );
    });
    it('should throw an error if from and from_nested are both defined', () => {
      expect(() => From.fromJSON({ from: 'group', from_nested: [] })).toThrow(
        'From and FromNested cannot be defined at the same time'
      );
    });
    it('should return a FromGroup object if from is defined', () => {
      const from = From.fromJSON({ from: 'group' });
      expect(from.__type).toBe('FromGroup');
    });
    it('should return a FromNested object if from_nested is defined', () => {
      const from = From.fromJSON({ from_nested: [] });
      expect(from.__type).toBe('FromNested');
    });
  });
  describe('FromGroup', () => {
    describe('constructor', () => {
      it('should return the JSON representation of FromGroup', () => {
        const from = new From.FromGroup(new Group('group'));
        expect(from.toJSON()).toEqual({ from: 'group' });
      });
    });
    describe('toJSON', () => {
      it('should return the JSON representation of FromGroup', () => {
        const from = new From.FromGroup(new Group('group'));
        expect(from.toJSON()).toEqual({ from: 'group' });
      });
    });
  });
  describe('FromNested', () => {
    describe('constructor', () => {
      it('should return the JSON representation of FromNested', () => {
        const from = new From.FromNested([]);
        expect(from.toJSON()).toEqual({ from_nested: [] });
      });
    });
    describe('toJSON', () => {
      it('should return the JSON representation of FromNested', () => {
        const from = new From.FromNested([]);
        expect(from.toJSON()).toEqual({ from_nested: [] });
      });
    });
  });
});
