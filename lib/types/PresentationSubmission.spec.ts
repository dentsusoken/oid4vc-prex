import { describe, expect, it } from 'vitest';
import { DescriptorMap } from './DescriptorMap';
import {
  PresentationSubmission,
  presentationSubmissionSchema,
} from './PresentationSubmission';
import basicPS from '../../example/presentation-submission/basic-example.json';
import { InputDescriptorId } from './InputDescriptorId';
import { JsonPath } from './JsonPath';

describe('PresentationSubmission', () => {
  describe('presentationSubmissionSchema', () => {
    it('should validate value', () => {
      expect(presentationSubmissionSchema.parse(basicPS)).toEqual(basicPS);
    });
    it('should throw error if value is invalid', () => {
      expect(() => presentationSubmissionSchema.parse({})).toThrow();
    });
  });
  describe('constructor', () => {
    it('should create instance', () => {
      const presentationSubmission = new PresentationSubmission(
        new InputDescriptorId(basicPS.id),
        new InputDescriptorId(basicPS.definition_id),
        basicPS.descriptor_map.map((dm) => {
          return new DescriptorMap(
            new InputDescriptorId(dm.id),
            dm.format,
            JsonPath.fromString(dm.path)!
          );
        })
      );

      expect(presentationSubmission).toBeInstanceOf(PresentationSubmission);
      expect(presentationSubmission.id.value).toBe(basicPS.id);
      expect(presentationSubmission.definition_id.value).toBe(
        basicPS.definition_id
      );
      expect(presentationSubmission.descriptor_map).toHaveLength(
        basicPS.descriptor_map.length
      );
    });
  });
  describe('fromJSON', () => {
    it('should create instance', () => {
      const presentationSubmission = PresentationSubmission.fromJSON(
        presentationSubmissionSchema.parse(basicPS)
      );

      console.log('presentationSubmission :>> ', presentationSubmission);

      expect(presentationSubmission).toBeInstanceOf(PresentationSubmission);
      expect(presentationSubmission.id.value).toBe(basicPS.id);
      expect(presentationSubmission.definition_id.value).toBe(
        basicPS.definition_id
      );
      expect(presentationSubmission.descriptor_map).toHaveLength(
        basicPS.descriptor_map.length
      );
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const presentationSubmission = PresentationSubmission.fromJSON(
        presentationSubmissionSchema.parse(basicPS)
      );

      expect(presentationSubmission.toJSON()).toEqual(basicPS);
    });
  });
});
