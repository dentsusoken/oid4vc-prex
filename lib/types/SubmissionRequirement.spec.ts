import { describe, expect, it } from 'vitest';
import { SubmissionRequirement } from './SubmissionRequirement';
import { Rule } from './Rule';
import { From } from './From';
import { Group } from './Group';

describe('SubmissionRequirement', () => {
  describe('constructor', () => {
    it('should create a new SubmissionRequirement instance', () => {
      const submissionRequirement = new SubmissionRequirement(
        Rule.All.readResolve(),
        new From.FromGroup(new Group('group-1'))
      );
      expect(submissionRequirement).toBeInstanceOf(SubmissionRequirement);
    });
  });
  describe('fromJSON', () => {
    it('should create a SubmissionRequirement instance from a JSON object', () => {
      const submissionRequirement = SubmissionRequirement.fromJSON({
        rule: 'all',
        from: 'group-1',
      });
      expect(submissionRequirement).toBeInstanceOf(SubmissionRequirement);
    });
    it('should throw an error if from and from_nested are not defined', () => {
      expect(() => {
        SubmissionRequirement.fromJSON({
          rule: 'all',
        });
      }).toThrowError('From or FromNested must be defined');
    });
    it('should throw an error if from and from_nested are both defined', () => {
      expect(() => {
        SubmissionRequirement.fromJSON({
          rule: 'all',
          from: 'group-1',
          from_nested: [],
        });
      }).toThrowError('From or FromNested must be defined');
    });
  });
  describe('toJSON', () => {
    it('should return a JSON object', () => {
      const submissionRequirement = new SubmissionRequirement(
        Rule.All.readResolve(),
        new From.FromGroup(new Group('group-1'))
      );
      const json = submissionRequirement.toJSON();
      expect(json).toEqual({
        rule: 'all',
        from: 'group-1',
      });
    });
  });
  describe('submissionRequirementSchema', () => {
    it('should return a valid schema', () => {
      const submissionRequirement = SubmissionRequirement.fromJSON({
        rule: 'all',
        from: 'group-1',
        name: 'name',
        purpose: 'purpose',
      });
      const json = submissionRequirement.toJSON();
      expect(submissionRequirement).toBeInstanceOf(SubmissionRequirement);
      expect(json).toEqual({
        rule: 'all',
        from: 'group-1',
        name: 'name',
        purpose: 'purpose',
      });
    });
  });
  describe('allGroups', () => {
    it('should return all groups', () => {
      const submissionRequirement = SubmissionRequirement.fromJSON({
        rule: 'all',
        from_nested: [
          {
            rule: 'all',
            from: 'group-1',
          },
          {
            rule: 'all',
            from_nested: [
              {
                rule: 'all',
                from: 'group-2',
              },
              {
                rule: 'all',
                from: 'group-3',
              },
            ],
          },
        ],
      });
      const groups = SubmissionRequirement.allGroups(submissionRequirement);
      expect(groups).toEqual(new Set(['group-1', 'group-2', 'group-3']));
    });
  });
});
