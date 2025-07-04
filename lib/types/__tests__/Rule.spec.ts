import { describe, it, expect } from 'vitest';
import { Rule, allSchema, pickSchema, ruleSchema } from '../Rule';

describe('Rule', () => {
  describe('allSchema', () => {
    it('should return true for valid input', () => {
      expect(allSchema.safeParse({ rule: 'all' }).success).toBe(true);
    });

    it('should return false for invalid input', () => {
      expect(allSchema.safeParse('all').success).toBe(false);
    });
  });
  describe('pickSchema', () => {
    it('should return true for valid input', () => {
      expect(
        pickSchema.safeParse({ rule: 'pick', count: 1, min: 0, max: 1 }).success
      ).toBe(true);
    });

    it('should return false for invalid input', () => {
      expect(
        pickSchema.safeParse({ rule: 'pick', count: '1', min: 0, max: 1 })
          .success
      ).toBe(false);
    });
  });
  describe('ruleSchema', () => {
    it('should return true for valid input', () => {
      expect(ruleSchema.safeParse({ rule: 'all' }).success).toBe(true);
      expect(
        ruleSchema.safeParse({ rule: 'pick', count: 1, min: 0, max: 1 }).success
      ).toBe(true);
    });
    it('should return false for invalid input', () => {
      expect(ruleSchema.safeParse({ rule: 'invalid' }).success).toBe(false);
      expect(
        ruleSchema.safeParse({ rule: 'pick', count: '1', min: 0, max: 1 })
          .success
      ).toBe(false);
    });
  });
  describe('fromJSON', () => {
    it('should return Rule.all for { rule: "all" }', () => {
      expect(Rule.fromJSON({ rule: 'all' })).toBeInstanceOf(Rule.All);
    });
    it('should return Rule.pick for { rule: "pick" }', () => {
      expect(
        Rule.fromJSON({ rule: 'pick', count: 1, min: 0, max: 1 })
      ).toBeInstanceOf(Rule.Pick);
    });
    it('should throw an error for invalid input', () => {
      // @ts-expect-error
      expect(() => Rule.fromJSON({ rule: 'invalid' })).toThrowError(
        'Invalid input'
      );
    });
  });
  describe('All', () => {
    describe('readResolve', () => {
      it('should return an instance of All', () => {
        expect(Rule.All.readResolve()).toBeInstanceOf(Rule.All);
      });
    });
    describe('toJSON', () => {
      it('should return { rule: "all" }', () => {
        expect(Rule.All.readResolve().toJSON()).toEqual({ rule: 'all' });
      });
    });
  });
  describe('Pick', () => {
    describe('constructor', () => {
      it('should return an instance of Pick', () => {
        expect(new Rule.Pick(1, 0, 1)).toBeInstanceOf(Rule.Pick);
      });
    });
    describe('toJSON', () => {
      it('should return { rule: "pick", count: 1, min: 0, max: 1 }', () => {
        expect(new Rule.Pick(1, 0, 1).toJSON()).toEqual({
          rule: 'pick',
          count: 1,
          min: 0,
          max: 1,
        });
      });
    });
  });
});
