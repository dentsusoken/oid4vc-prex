import { describe, expect, it } from 'vitest';
import {
  Constraints,
  FieldsConstraints,
  fieldConstraintsSchema,
  limitDisclosureSchema,
} from './Constraints';
import { FieldConstraint } from './FieldConstraint';

describe('Constraints', () => {
  describe('fieldConstraintsSchema', () => {
    it('should validate', () => {
      const fieldConstraints = [
        FieldConstraint.fromJSON({
          path: ['$.a'],
        }),
      ];
      const result = fieldConstraintsSchema.parse(fieldConstraints);
      expect(result).toEqual(fieldConstraints);
    });
    it('should throw error if invalid', () => {
      const fieldConstraints = [];
      expect(() => fieldConstraintsSchema.parse(fieldConstraints)).toThrow();
    });
  });
  describe('limitDisclosure', () => {
    it('should validate', () => {
      const result = limitDisclosureSchema.parse('required');
      expect(result).toBe('required');
    });
    it('should throw error if invalid', () => {
      expect(() => limitDisclosureSchema.parse('')).toThrow();
    });
  });
  describe('FieldsConstraints', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const fieldConstraints = new FieldsConstraints([
          FieldConstraint.fromJSON({ path: ['$.a'] }),
        ]);
        expect(fieldConstraints).toBeInstanceOf(FieldsConstraints);
      });
    });
    describe('fromJSON', () => {
      it('should create instance from JSON', () => {
        const fieldConstraints = FieldsConstraints.fromJSON([
          FieldConstraint.fromJSON({ path: ['$.a'] }),
        ]);
        expect(fieldConstraints).toBeInstanceOf(FieldsConstraints);
      });
    });
    describe('toJSON', () => {
      it('should return JSON', () => {
        const fieldConstraints = new FieldsConstraints([
          FieldConstraint.fromJSON({ path: ['$.a'] }),
        ]);
        const result = fieldConstraints.toJSON();
        expect(result).toEqual([{ path: ['$.a'] }]);
      });
    });
  });
  describe('Fields', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const fieldConstraints = new Constraints.Fields([
          FieldConstraint.fromJSON({ path: ['$.a'] }),
        ]);
        expect(fieldConstraints).toBeInstanceOf(Constraints.Fields);
      });
      it('should throw error if invalid', () => {
        // @ts-ignore
        expect(() => new Constraints.Fields([])).toThrow();
      });
    });
    describe('fromJSON', () => {
      it('should create instance from JSON', () => {
        const fieldConstraints = Constraints.Fields.fromJSON([
          FieldConstraint.fromJSON({ path: ['$.a'] }),
        ]);
        expect(fieldConstraints).toBeInstanceOf(Constraints.Fields);
      });
    });
    describe('toJSON', () => {
      it('should return JSON', () => {
        const fieldConstraints = new Constraints.Fields([
          FieldConstraint.fromJSON({ path: ['$.a'] }),
        ]);
        const result = fieldConstraints.toJSON();
        expect(result).toEqual([{ path: ['$.a'] }]);
      });
    });
  });
  describe('LimitDisclosure', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const limitDisclosure = Constraints.LimitDisclosure.REQUIRED;
        expect(limitDisclosure).toBeInstanceOf(Constraints.LimitDisclosure);
      });
    });
    describe('fromString', () => {
      it('should create instance from JSON', () => {
        const limitDisclosure =
          Constraints.LimitDisclosure.fromString('required');
        expect(limitDisclosure).toBeInstanceOf(Constraints.LimitDisclosure);
      });
      it('should throw error if invalid', () => {
        expect(() =>
          Constraints.LimitDisclosure.fromString('invalid' as any)
        ).toThrow();
      });
    });
    describe('toJSON', () => {
      it('should return JSON', () => {
        const limitDisclosure = Constraints.LimitDisclosure.REQUIRED;
        const result = limitDisclosure.toJSON();
        expect(result).toBe('required');
      });
    });
  });
  describe('FieldsAndDisclosure', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const fieldsAndDisclosure = new Constraints.FieldsAndDisclosure(
          [FieldConstraint.fromJSON({ path: ['$.a'] })],
          Constraints.LimitDisclosure.REQUIRED
        );
        expect(fieldsAndDisclosure).toBeInstanceOf(
          Constraints.FieldsAndDisclosure
        );
      });
    });
  });
  describe('fields', () => {
    it('should return Fields instance', () => {
      const fields = new Constraints.Fields([
        FieldConstraint.fromJSON({ path: ['$.a'] }),
      ]);

      expect(Constraints.fields(fields)).toEqual(fields.fieldConstraints);
    });
    it('should return empty array if invalid', () => {
      expect(
        Constraints.fields(Constraints.LimitDisclosure.PREFERRED)
      ).toStrictEqual([]);
    });
  });
  describe('limitDisclosure', () => {
    it('should return LimitDisclosure instance', () => {
      const limitDisclosure = Constraints.LimitDisclosure.REQUIRED;
      const fieldsAndDisclosure = new Constraints.FieldsAndDisclosure(
        [FieldConstraint.fromJSON({ path: ['$.a'] })],
        limitDisclosure
      );
      expect(Constraints.limitDisclosure(limitDisclosure)).toEqual(
        limitDisclosure
      );
      expect(Constraints.limitDisclosure(fieldsAndDisclosure)).toEqual(
        limitDisclosure
      );
    });
    it('should return undefined if invalid', () => {
      expect(Constraints.limitDisclosure('invalid' as any)).toBe(undefined);
    });
  });
  describe('of', () => {
    it('should return FieldsAndDisclosure instance', () => {
      const fieldsAndDisclosure = Constraints.of(
        [FieldConstraint.fromJSON({ path: ['$.a'] })],
        Constraints.LimitDisclosure.REQUIRED
      );
      expect(fieldsAndDisclosure).toBeInstanceOf(
        Constraints.FieldsAndDisclosure
      );
    });
    it('should return Fields instance if limitDisclosure is not provided', () => {
      const fields = Constraints.of([
        FieldConstraint.fromJSON({ path: ['$.a'] }),
      ]);
      expect(fields).toBeInstanceOf(Constraints.Fields);
    });
    it("should return LimitDisclosure instance if fields is not provided and limitDisclosure is 'required'", () => {
      const limitDisclosure = Constraints.of(
        undefined,
        Constraints.LimitDisclosure.REQUIRED
      );
      expect(limitDisclosure).toBeInstanceOf(Constraints.LimitDisclosure);
    });
    it('should return undefined if both of args are undefined', () => {
      expect(Constraints.of()).toBe(undefined);
    });
  });
});
