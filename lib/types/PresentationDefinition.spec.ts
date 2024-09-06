import { describe, expect, it } from 'vitest';
import {
  PresentationDefinition,
  presentationDefinitionSchema,
} from './PresentationDefinition';
import { InputDescriptor } from './InputDescriptor';
import { Id } from './Id';
import basicPD from '../../mock-data/presentation-definition/basic-example.json';
import mDLPD from '../../mock-data/presentation-definition/mDL-example.json';

describe('PresentationDefinition', () => {
  describe('presentationDefinitionSchema', () => {
    it('should validate value', () => {
      expect(presentationDefinitionSchema.parse(basicPD)).toEqual(basicPD);
    });
    it('should throw error if value is invalid', () => {
      expect(() => presentationDefinitionSchema.parse({})).toThrow();
    });
  });
  describe('constructor', () => {
    it('should create instance', () => {
      const presentationDefinition = new PresentationDefinition(
        new Id(basicPD.id)
      );

      expect(presentationDefinition).toBeInstanceOf(PresentationDefinition);
      expect(presentationDefinition.id.value).toBe(basicPD.id);
    });
  });
  describe('fromJSON', () => {
    it('should create instance', () => {
      const presentationDefinition = PresentationDefinition.fromJSON(
        presentationDefinitionSchema.parse(basicPD)
      );

      expect(presentationDefinition).toBeInstanceOf(PresentationDefinition);
      expect(presentationDefinition.id.value).toBe(basicPD.id);
      expect(presentationDefinition.inputDescriptors).toBeInstanceOf(Array);
      expect(presentationDefinition.inputDescriptors?.[0]).toBeInstanceOf(
        InputDescriptor
      );
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const basic = PresentationDefinition.fromJSON(
        presentationDefinitionSchema.parse(basicPD)
      );
      const mDL = PresentationDefinition.fromJSON(
        presentationDefinitionSchema.parse(mDLPD)
      );

      expect(basic.toJSON()).toEqual(basicPD);
      expect(mDL.toJSON()).toEqual(mDLPD);
    });
  });
});
