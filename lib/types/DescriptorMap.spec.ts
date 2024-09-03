import { describe, expect, it } from 'vitest';
import { DescriptorMap, descriptorMapSchema } from './DescriptorMap';
import basicSM from '../../example/presentation-submission/basic-example.json';
import { InputDescriptorId } from './InputDescriptorId';
import { JsonPath } from './JsonPath';

const descriptor_map = basicSM.descriptor_map[3];

describe('DescriptorMap', () => {
  describe('descriptorMapSchema', () => {
    it('should validate value', () => {
      expect(descriptorMapSchema.parse(descriptor_map)).toEqual(descriptor_map);
    });
    it('should throw error if value is invalid', () => {
      expect(() => descriptorMapSchema.parse({})).toThrow();
    });
  });
  describe('constructor', () => {
    it('should create instance', () => {
      const descriptorMap = new DescriptorMap(
        new InputDescriptorId(descriptor_map.id),
        descriptor_map.format,
        JsonPath.fromString(descriptor_map.path)!
      );

      expect(descriptorMap).toBeInstanceOf(DescriptorMap);
      expect(descriptorMap.id.value).toBe(descriptor_map.id);
      expect(descriptorMap.format).toBe(descriptor_map.format);
      expect(descriptorMap.path.value).toBe(descriptor_map.path);
    });
  });
  describe('fromJSON', () => {
    it('should create instance', () => {
      const descriptorMap = DescriptorMap.fromJSON(
        descriptorMapSchema.parse(descriptor_map)
      );

      expect(descriptorMap).toBeInstanceOf(DescriptorMap);
      expect(descriptorMap.id.value).toBe(descriptor_map.id);
      expect(descriptorMap.format).toBe(descriptor_map.format);
      expect(descriptorMap.path.value).toBe(descriptor_map.path);
    });
  });
  describe('toJSON', () => {
    it('should return value', () => {
      const descriptorMap = DescriptorMap.fromJSON(
        descriptorMapSchema.parse(descriptor_map)
      );

      expect(descriptorMap.toJSON()).toEqual(descriptor_map);
    });
  });
});
