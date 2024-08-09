import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import {
  DescriptorMap,
  InputDescriptorId,
  JsonPath,
  PathNested,
} from './Types';

describe('DescriptorMap', () => {
  describe('plainToInstance', () => {
    it('should translate a plain object into DescriptorMap instance', () => {
      const plain = {
        id: 'descriptor1',
        format: 'json',
        path: '$.data.value',
        path_nested: {
          format: 'nested',
          path: '$.nested.value',
        },
      };

      const instance = plainToInstance(DescriptorMap, plain);

      expect(instance).toBeInstanceOf(DescriptorMap);
      expect(instance.id).toBeInstanceOf(InputDescriptorId);
      expect(instance.id?.value).toBe('descriptor1');
      expect(instance.format).toBe('json');
      expect(instance.path).toBeInstanceOf(JsonPath);
      expect(instance.path?.value).toBe('$.data.value');
      expect(instance.pathNested).toBeInstanceOf(PathNested);
      expect(instance.pathNested?.format).toBe('nested');
      expect(instance.pathNested?.path).toBeInstanceOf(JsonPath);
      expect(instance.pathNested?.path?.value).toBe('$.nested.value');
    });

    it('should handle missing properties', () => {
      const plain = {};

      const instance = plainToInstance(DescriptorMap, plain);
      console.log(instance);

      expect(instance).toBeInstanceOf(DescriptorMap);
      expect(instance.id).toBeUndefined();
      expect(instance.format).toBeUndefined();
      expect(instance.path).toBeUndefined();
      expect(instance.pathNested).toBeUndefined();
    });
  });

  describe('instanceToPlain', () => {
    it('should translate a DescriptorMap instance into a plain object', () => {
      const instance = new DescriptorMap(
        new InputDescriptorId('descriptor1'),
        'json',
        JsonPath.jsonPath('$.data.value')!,
        new PathNested('nested', JsonPath.jsonPath('$.nested.value')!)
      );

      const plain = instanceToPlain(instance);

      expect(plain).toEqual({
        id: 'descriptor1',
        format: 'json',
        path: '$.data.value',
        path_nested: {
          format: 'nested',
          path: '$.nested.value',
        },
      });
    });

    it('should handle undefined properties', () => {
      const instance = new DescriptorMap();

      const plain = instanceToPlain(instance);

      expect(plain).toEqual({});
    });
  });

  describe('constructor', () => {
    it('should create an instance with provided values', () => {
      const id = new InputDescriptorId('descriptor1');
      const path = JsonPath.jsonPath('$.data.value')!;
      const pathNested = new PathNested(
        'nested',
        JsonPath.jsonPath('$.nested.value')!
      );
      const instance = new DescriptorMap(id, 'json', path, pathNested);

      expect(instance.id).toBe(id);
      expect(instance.format).toBe('json');
      expect(instance.path).toBe(path);
      expect(instance.pathNested).toBe(pathNested);
    });

    it('should create an empty instance when no arguments are provided', () => {
      const instance = new DescriptorMap();

      expect(instance.id).toBeUndefined();
      expect(instance.format).toBeUndefined();
      expect(instance.path).toBeUndefined();
      expect(instance.pathNested).toBeUndefined();
    });
  });
});
