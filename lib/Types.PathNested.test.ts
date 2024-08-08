import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { PathNested, JsonPath } from './Types';

describe('PathNested', () => {
  describe('plainToInstance', () => {
    it('should translate a plain object into PathNested instance', () => {
      const plain = {
        format: 'json',
        path: '$.data.value',
      };

      const instance = plainToInstance(PathNested, plain);

      expect(instance).toBeInstanceOf(PathNested);
      expect(instance.format).toBe('json');
      expect(instance.path).toBeInstanceOf(JsonPath);
      expect(instance.path?.value).toBe('$.data.value');
    });

    it('should handle missing properties', () => {
      const plain = {};

      const instance = plainToInstance(PathNested, plain);

      expect(instance).toBeInstanceOf(PathNested);
      expect(instance.format).toBeUndefined();
      expect(instance.path).toBeUndefined();
    });
  });

  describe('instanceToPlain', () => {
    it('should translate a PathNested instance into a plain object', () => {
      const instance = new PathNested(
        'json',
        JsonPath.jsonPath('$.data.value')!
      );

      const plain = instanceToPlain(instance);

      expect(plain).toEqual({
        format: 'json',
        path: '$.data.value',
      });
    });

    it('should handle undefined properties', () => {
      const instance = new PathNested();

      const plain = instanceToPlain(instance);

      expect(plain).toEqual({});
    });
  });

  describe('constructor', () => {
    it('should create an instance with provided values', () => {
      const instance = new PathNested(
        'json',
        JsonPath.jsonPath('$.data.value')!
      );

      expect(instance.format).toBe('json');
      expect(instance.path).toBeInstanceOf(JsonPath);
      expect(instance.path?.value).toBe('$.data.value');
    });

    it('should create an empty instance when no arguments are provided', () => {
      const instance = new PathNested();

      expect(instance.format).toBeUndefined();
      expect(instance.path).toBeUndefined();
    });
  });
});
