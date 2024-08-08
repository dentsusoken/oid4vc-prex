import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { FieldConstraint, Filter, Id, JsonPath, Name, Purpose } from './Types';

describe('FieldConstraint', () => {
  describe('plainToInstance', () => {
    it('should translate a plain object into self instance', () => {
      const plain = {
        path: ['$.abc', '$.hoge'],
        filter: {
          type: 'string',
          const: 'https://train.trust-scheme.de/info',
        },
        id: 'abc',
        name: 'xyz',
        purpose: 'trip',
      };
      const instance = plainToInstance(FieldConstraint, plain);
      expect(instance).toBeInstanceOf(FieldConstraint);
      expect(instance.paths?.length).toBe(2);
      expect(instance.paths![0]).toBeInstanceOf(JsonPath);
      expect(instance.paths![0].value).toBe('$.abc');
      expect(instance.paths![1].value).toBe('$.hoge');
      expect(instance.filter).toBeInstanceOf(Filter);
      expect(instance.filter?.value).toBe(
        '{"type":"string","const":"https://train.trust-scheme.de/info"}'
      );
      expect(instance.id).toBeInstanceOf(Id);
      expect(instance.id?.value).toBe(plain.id);
      expect(instance.name).toBeInstanceOf(Name);
      expect(instance.name?.value).toBe(plain.name);
      expect(instance.purpose).toBeInstanceOf(Purpose);
      expect(instance.purpose?.value).toBe(plain.purpose);
    });
  });

  describe('instanceToPlain', () => {
    it('should translate a FieldConstraint instance into a plain object', () => {
      const instance = new FieldConstraint();
      instance.paths = [
        JsonPath.jsonPath('$.abc')!,
        JsonPath.jsonPath('$.hoge')!,
      ];
      instance.filter = Filter.filter({
        type: 'string',
        const: 'https://train.trust-scheme.de/info',
      });
      instance.id = new Id('abc');
      instance.name = new Name('xyz');
      instance.purpose = new Purpose('trip');

      const plain = instanceToPlain(instance, {
        exposeUnsetFields: false,
      });
      console.log(plain);

      expect(plain).toEqual({
        path: ['$.abc', '$.hoge'],
        filter: {
          type: 'string',
          const: 'https://train.trust-scheme.de/info',
        },
        id: 'abc',
        name: 'xyz',
        purpose: 'trip',
      });
    });
  });
});
