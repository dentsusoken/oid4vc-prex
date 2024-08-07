import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import {
  Constraints,
  FieldConstraint,
  FieldsConstraints,
  Filter,
  Format,
  From,
  Group,
  Id,
  InputDescriptor,
  InputDescriptorId,
  JsonPath,
  Name,
  PresentationDefinition,
  Purpose,
  Rule,
  SubmissionRequirement,
} from './Types';

describe('Types', () => {
  describe('PresentationDefinition', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const presentationDefinition = new PresentationDefinition(
          new Id('abc'),
          new Name('abc'),
          new Purpose('abc'),
          Format.format({ value: 'abc' }),
          [
            new InputDescriptor(
              new InputDescriptorId('abc'),
              new Name('abc'),
              new Purpose('abc'),
              Format.format({ value: 'abc' }),
              new Constraints.Fields([
                new FieldConstraint(
                  [JsonPath.jsonPath('$.abc')!],
                  new Id('abc'),
                  new Name('abc'),
                  new Purpose('abc'),
                  Filter.filter({ value: 'abc' }),
                  true,
                  true
                ),
              ]),
              [new Group('abc')]
            ),
          ],
          [
            new SubmissionRequirement(
              Rule.All.readResolve(),
              new From.FromGroup(new Group('abc'))
            ),
          ]
        );
        expect(presentationDefinition).toBeInstanceOf(PresentationDefinition);
      });

      it('should shoud throw error when same id InputDescriptors exist', () => {
        const inputDescriptor = new InputDescriptor(
          new InputDescriptorId('abc'),
          new Name('abc'),
          new Purpose('abc'),
          Format.format({ value: 'abc' }),
          new Constraints.Fields([
            new FieldConstraint(
              [JsonPath.jsonPath('$.abc')!],
              new Id('abc'),
              new Name('abc'),
              new Purpose('abc'),
              Filter.filter({ value: 'abc' }),
              true,
              true
            ),
          ]),
          [new Group('abc')]
        );
        expect(
          () =>
            new PresentationDefinition(
              new Id('abc'),
              new Name('abc'),
              new Purpose('abc'),
              Format.format({ value: 'abc' }),
              [inputDescriptor, inputDescriptor],
              [
                new SubmissionRequirement(
                  Rule.All.readResolve(),
                  new From.FromGroup(new Group('abc'))
                ),
              ]
            )
        ).toThrowError(
          'InputDescriptor(s) should have PresentationDefinition unique ids'
        );
      });

      it('should shoud throw error when InputDescriptor.Group.value and SubmissionRequirement.Group.value are different', () => {
        expect(
          () =>
            new PresentationDefinition(
              new Id('abc'),
              new Name('abc'),
              new Purpose('abc'),
              Format.format({ value: 'abc' }),
              [
                new InputDescriptor(
                  new InputDescriptorId('abc'),
                  new Name('abc'),
                  new Purpose('abc'),
                  Format.format({ value: 'abc' }),
                  new Constraints.Fields([
                    new FieldConstraint(
                      [JsonPath.jsonPath('$.abc')!],
                      new Id('abc'),
                      new Name('abc'),
                      new Purpose('abc'),
                      Filter.filter({ value: 'abc' }),
                      true,
                      true
                    ),
                  ]),
                  [new Group('abc')]
                ),
              ],
              [
                new SubmissionRequirement(
                  Rule.All.readResolve(),
                  new From.FromGroup(new Group('def'))
                ),
              ]
            )
        ).toThrowError(
          'Input descriptor ${inputDescriptor.id} ' +
            'contains groups ${grp.value} which is not present in submission requirements'
        );
      });
    });

    describe('plainToInstance', () => {
      it('should translate a plain object into self instance', () => {
        const plain = {
          id: 'abc',
          name: 'xyz',
          purpose: 'trip',
          format: {},
          input_descriptors: [
            {
              id: 'federationExample',
              purpose:
                'To pick a UK university that is a member of the UK academic federation',
              constraints: {
                fields: [
                  {
                    path: ['$.termsOfUse.type'],
                    filter: {
                      type: 'string',
                      const: 'https://train.trust-scheme.de/info',
                    },
                  },
                  {
                    path: ['$.termsOfUse.federations'],
                    filter: {
                      type: 'string',
                      const: 'ukuniversities.ac.uk',
                    },
                  },
                ],
              },
            },
          ],
        };
        const instance = plainToInstance(PresentationDefinition, plain);
        expect(instance).toBeInstanceOf(PresentationDefinition);
        expect(instance.id).toBeInstanceOf(Id);
        expect(instance.id?.value).toBe(plain.id);
        expect(instance.name).toBeInstanceOf(Name);
        expect(instance.name?.value).toBe(plain.name);
        expect(instance.purpose).toBeInstanceOf(Purpose);
        expect(instance.purpose?.value).toBe(plain.purpose);
        expect(instance.format).toBeInstanceOf(Format);
        expect(instance.format?.json).toBe(JSON.stringify(plain.format));
      });
    });
  });

  describe('InputDescriptor', () => {
    describe('plainToInstance', () => {
      it('should translate a plain object into self instance', () => {
        const plain = {
          id: 'abc',
          name: 'xyz',
          purpose: 'trip',
          format: {},
          constraints: {
            fields: [
              {
                path: ['$.termsOfUse.type'],
                filter: {
                  type: 'string',
                  const: 'https://train.trust-scheme.de/info',
                },
              },
              {
                path: ['$.termsOfUse.federations'],
                filter: {
                  type: 'string',
                  const: 'ukuniversities.ac.uk',
                },
              },
            ],
          },
        };
        const instance = plainToInstance(InputDescriptor, plain);
        expect(instance).toBeInstanceOf(InputDescriptor);
        expect(instance.id).toBeInstanceOf(InputDescriptorId);
        expect(instance.id?.value).toBe(plain.id);
        expect(instance.name).toBeInstanceOf(Name);
        expect(instance.name?.value).toBe(plain.name);
        expect(instance.purpose).toBeInstanceOf(Purpose);
        expect(instance.purpose?.value).toBe(plain.purpose);
        expect(instance.format).toBeInstanceOf(Format);
        expect(instance.format?.json).toBe(JSON.stringify(plain.format));
        console.log(instance.constraints);
        expect(instance.constraints).toBeInstanceOf(FieldsConstraints);
        expect(instance.constraints!.fields.length).toBe(2);
        expect(instance.constraints!.fields[0]).toBeInstanceOf(FieldConstraint);
      });
    });
  });

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
  });
});