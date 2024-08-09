import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import {
  PresentationSubmission,
  Id,
  DescriptorMap,
  JsonPath,
  InputDescriptorId,
} from './Types';
import { Nested } from './Types.PresentationSubmission.test.types';

describe('PresentationSubmission', () => {
  describe('plainToInstance', () => {
    it('should translate a plain object into PresentationSubmission instance', () => {
      const plain = {
        id: 'submission1',
        definition_id: 'def1',
        descriptor_map: [
          {
            id: 'desc1',
            format: 'json',
            path: '$.data.value',
          },
          {
            id: 'desc2',
            format: 'xml',
            path: '$.other.value',
          },
        ],
      };

      const instance = plainToInstance(PresentationSubmission, plain);

      expect(instance).toBeInstanceOf(PresentationSubmission);
      expect(instance.id).toBeInstanceOf(Id);
      expect(instance.id?.value).toBe('submission1');
      expect(instance.definitionId).toBeInstanceOf(Id);
      expect(instance.definitionId?.value).toBe('def1');
      expect(instance.descriptorMaps).toHaveLength(2);
      expect(instance.descriptorMaps?.[0]).toBeInstanceOf(DescriptorMap);
      expect(instance.descriptorMaps?.[0]?.id).toBeInstanceOf(
        InputDescriptorId
      );
      expect(instance.descriptorMaps?.[0]?.id?.value).toBe('desc1');
      expect(instance.descriptorMaps?.[0]?.format).toBe('json');
      expect(instance.descriptorMaps?.[0]?.path).toBeInstanceOf(JsonPath);
      expect(instance.descriptorMaps?.[0]?.path?.value).toBe('$.data.value');
    });

    it('should handle missing properties', () => {
      const plain = {
        id: 'submission1',
        definition_id: 'def1',
      };

      const instance = plainToInstance(PresentationSubmission, plain);

      expect(instance).toBeInstanceOf(PresentationSubmission);
      expect(instance.id).toBeInstanceOf(Id);
      expect(instance.id?.value).toBe('submission1');
      expect(instance.definitionId).toBeInstanceOf(Id);
      expect(instance.definitionId?.value).toBe('def1');
      expect(instance.descriptorMaps).toBeUndefined();
    });
  });

  describe('instanceToPlain', () => {
    it('should translate a PresentationSubmission instance into a plain object', () => {
      const instance = new PresentationSubmission(
        new Id('submission1'),
        new Id('def1'),
        [
          new DescriptorMap(
            new Id('desc1'),
            'json',
            JsonPath.jsonPath('$.data.value')!
          ),
          new DescriptorMap(
            new Id('desc2'),
            'xml',
            JsonPath.jsonPath('$.other.value')!
          ),
        ]
      );

      const plain = instanceToPlain(instance);

      expect(plain).toEqual({
        id: 'submission1',
        definition_id: 'def1',
        descriptor_map: [
          {
            id: 'desc1',
            format: 'json',
            path: '$.data.value',
          },
          {
            id: 'desc2',
            format: 'xml',
            path: '$.other.value',
          },
        ],
      });
    });

    it('should correctly transform plain object to Nested instance', () => {
      const plain = {
        presentation_submission: {
          id: 'submission1',
          definition_id: 'def1',
          descriptor_map: [
            {
              id: 'desc1',
              format: 'json',
              path: '$.data.value',
            },
          ],
        },
      };

      const nested = plainToInstance(Nested, plain, {
        excludeExtraneousValues: true,
      });

      expect(nested).toBeInstanceOf(Nested);
      expect(nested.presentationSubmission).toBeInstanceOf(
        PresentationSubmission
      );

      expect(nested.presentationSubmission?.id).toBeInstanceOf(Id);
      expect(nested.presentationSubmission?.id?.value).toBe('submission1');
      expect(nested.presentationSubmission?.definitionId).toBeInstanceOf(Id);
      expect(nested.presentationSubmission?.definitionId?.value).toBe('def1');
      expect(nested.presentationSubmission?.descriptorMaps).toHaveLength(1);
      expect(nested.presentationSubmission?.descriptorMaps?.[0]).toBeInstanceOf(
        DescriptorMap
      );
      expect(nested.presentationSubmission?.descriptorMaps?.[0].id?.value).toBe(
        'desc1'
      );
      expect(nested.presentationSubmission?.descriptorMaps?.[0].format).toBe(
        'json'
      );
      expect(
        nested.presentationSubmission?.descriptorMaps?.[0].path?.value
      ).toBe('$.data.value');
    });

    it('should handle empty descriptor_map', () => {
      const instance = new PresentationSubmission(
        new Id('submission1'),
        new Id('def1'),
        []
      );

      const plain = instanceToPlain(instance);

      expect(plain).toEqual({
        id: 'submission1',
        definition_id: 'def1',
        descriptor_map: [],
      });
    });
  });

  describe('constructor', () => {
    it('should create an instance with provided values', () => {
      const id = new Id('submission1');
      const definitionId = new Id('def1');
      const descriptorMaps = [
        new DescriptorMap(
          new Id('desc1'),
          'json',
          JsonPath.jsonPath('$.data.value')!
        ),
      ];
      const instance = new PresentationSubmission(
        id,
        definitionId,
        descriptorMaps
      );

      expect(instance.id).toBe(id);
      expect(instance.definitionId).toBe(definitionId);
      expect(instance.descriptorMaps).toBe(descriptorMaps);
    });
  });
});
