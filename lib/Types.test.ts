import 'reflect-metadata';
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Constraints,
  DescriptorMap,
  FieldConstraint,
  Filter,
  Format,
  From,
  Group,
  Id,
  InputDescriptor,
  InputDescriptorId,
  JsonPath,
  Name,
  PresentationSubmission,
  Purpose,
  Rule,
  SubmissionRequirement,
  allGroups,
} from './Types';

describe('Types', () => {
  describe('Id', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const id = new Id('abc');
        expect(id).toBeInstanceOf(Id);
        expect(id.value).toBe('abc');
      });
    });
  });
  describe('Name', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const name = new Name('abc');
        expect(name).toBeInstanceOf(Name);
        expect(name.value).toBe('abc');
      });
    });
  });
  describe('Purpose', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const purpose = new Purpose('abc');
        expect(purpose).toBeInstanceOf(Purpose);
        expect(purpose.value).toBe('abc');
      });
    });
  });
  describe('Format', () => {
    describe('format', () => {
      it('should create instance', () => {
        const format = Format.format({ value: 'abc' });
        expect(format).toBeInstanceOf(Format);
      });
    });
    describe('jsonObject', () => {
      it('should return JsonObject', () => {
        const format = Format.format({ value: 'abc' });
        expect(format.jsonObject()).toEqual({ value: 'abc' });
      });
    });
  });
  describe('JsonPath', () => {
    describe('jsonPath', () => {
      it('should create instance', () => {
        const jsonPath = JsonPath.jsonPath('$.abc');
        expect(jsonPath).toBeInstanceOf(JsonPath);
      });
      it('should faild to create instance', () => {
        const jsonPath = JsonPath.jsonPath('.abc');
        expect(jsonPath).toBeUndefined();
      });
    });
  });
  describe('Filter', () => {
    describe('filter', () => {
      it('should create instance', () => {
        const filter = Filter.filter({ value: 'abc' });
        expect(filter).toBeInstanceOf(Filter);
      });
    });
    describe('jsonObject', () => {
      it('should return JsonObject', () => {
        const filter = Filter.filter({ value: 'abc' });
        expect(filter.jsonObject()).toEqual({ value: 'abc' });
      });
    });
  });
  describe('Constraints', () => {
    describe('fields', () => {
      it('should return FieldConstraint list', () => {
        const fieldConstraint = new FieldConstraint(
          [JsonPath.jsonPath('$.abc')!],
          new Id('abc'),
          new Name('abc'),
          new Purpose('abc'),
          Filter.filter({ value: 'abc' }),
          true,
          true
        );
        const fc = Constraints.fields(
          new Constraints.Fields([fieldConstraint])
        );
        expect(fc.length).toBe(1);
      });
      it('should return empty list', () => {
        const fc = Constraints.fields(Constraints.LimitDisclosure.PREFERRED);
        expect(fc.length).toBe(0);
      });
    });
    describe('limitDisclosure', () => {
      it('should return LimitDisclosure', () => {
        const ld = Constraints.limitDisclosure(
          Constraints.LimitDisclosure.PREFERRED
        );
        expect(ld).toBe(Constraints.LimitDisclosure.PREFERRED);
      });
      it('should return FieldsAndDisclosure', () => {
        const fad = new Constraints.FieldsAndDisclosure(
          [
            new FieldConstraint(
              [JsonPath.jsonPath('$.abc')!],
              new Id('abc'),
              new Name('abc'),
              new Purpose('abc'),
              Filter.filter({ value: 'abc' }),
              true,
              true
            ),
          ],
          Constraints.LimitDisclosure.PREFERRED
        );
        const ld = Constraints.limitDisclosure(fad);
        expect(ld).toBe(Constraints.LimitDisclosure.PREFERRED);
      });
      it('should return undefined', () => {
        const ld = Constraints.limitDisclosure(
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
          ])
        );
        expect(ld).toBeUndefined();
      });
    });
    describe('Fields', () => {
      describe('constructor', () => {
        it('should create instance', () => {
          const fields = new Constraints.Fields([
            new FieldConstraint(
              [JsonPath.jsonPath('$.abc')!],
              new Id('abc'),
              new Name('abc'),
              new Purpose('abc'),
              Filter.filter({ value: 'abc' }),
              true,
              true
            ),
          ]);
          expect(fields).toBeInstanceOf(Constraints.Fields);
        });

        it('should throw error', () => {
          expect(() => {
            new Constraints.Fields([]);
          }).toThrowError('fieldConstraints is required');
        });
      });
    });
    describe('LimitDisclosure', () => {
      describe('constructor', () => {
        it('should create instance', () => {
          expect(Constraints.LimitDisclosure.PREFERRED).toBeInstanceOf(
            Constraints.LimitDisclosure
          );
          expect(Constraints.LimitDisclosure.REQUIRED).toBeInstanceOf(
            Constraints.LimitDisclosure
          );
        });
      });
      describe('toString', () => {
        it('should return value', () => {
          expect(Constraints.LimitDisclosure.PREFERRED.toString()).toBe(
            'PREFERRED'
          );
          expect(Constraints.LimitDisclosure.REQUIRED.toString()).toBe(
            'REQUIRED'
          );
        });
      });
      describe('fromString', () => {
        it('should return instance', () => {
          expect(
            Constraints.LimitDisclosure.fromString('PREFERRED')
          ).toBeInstanceOf(Constraints.LimitDisclosure);
          expect(
            Constraints.LimitDisclosure.fromString('REQUIRED')
          ).toBeInstanceOf(Constraints.LimitDisclosure);
        });
      });
    });
    describe('FieldsAndDisclosure', () => {
      describe('constructor', () => {
        it('should create instance', () => {
          const fad = new Constraints.FieldsAndDisclosure(
            [
              new FieldConstraint(
                [JsonPath.jsonPath('$.abc')!],
                new Id('abc'),
                new Name('abc'),
                new Purpose('abc'),
                Filter.filter({ value: 'abc' }),
                true,
                true
              ),
            ],
            Constraints.LimitDisclosure.PREFERRED
          );
          expect(fad).toBeInstanceOf(Constraints.FieldsAndDisclosure);
          expect(fad.fieldConstraints.length).toBe(1);
          expect(fad.limitDisclosure).toBe(
            Constraints.LimitDisclosure.PREFERRED
          );
        });
      });
    });
    describe('of', () => {
      it('should return FieldsAndDisclosure instance', () => {
        const fs = new FieldConstraint(
          [JsonPath.jsonPath('$.abc')!],
          new Id('abc'),
          new Name('abc'),
          new Purpose('abc'),
          Filter.filter({ value: 'abc' }),
          true,
          true
        );
        const ld = Constraints.LimitDisclosure.PREFERRED;

        const fad = Constraints.of([fs], ld);
        expect(fad).toBeInstanceOf(Constraints.FieldsAndDisclosure);
      });
      it('should return Fields instance', () => {
        const fs = new FieldConstraint(
          [JsonPath.jsonPath('$.abc')!],
          new Id('abc'),
          new Name('abc'),
          new Purpose('abc'),
          Filter.filter({ value: 'abc' }),
          true,
          true
        );

        const fad = Constraints.of([fs]);
        expect(fad).toBeInstanceOf(Constraints.Fields);
      });
    });
  });
  describe('Group', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const group = new Group('abc');
        expect(group).toBeInstanceOf(Group);
        expect(group.value).toBe('abc');
      });
    });
  });
  describe('From', () => {
    describe('FromGroup', () => {
      describe('constructor', () => {
        it('should create instance', () => {
          let from = new From.FromGroup(new Group('abc'));
          expect(from).toBeInstanceOf(From.FromGroup);
        });
      });
    });
    describe('FromNested', () => {
      describe('constructor', () => {
        it('should create instance', () => {
          const from = new From.FromNested([
            new SubmissionRequirement(Rule.All.readResolve(), [
              new From.FromGroup(new Group('abc')),
            ]),
          ]);
          expect(from).toBeInstanceOf(From.FromNested);
        });
      });
    });
  });
  describe('Rule', () => {
    describe('All', () => {
      describe('readResolve', () => {
        it('should return Rule instance', () => {
          const rule = Rule.All.readResolve();

          expect(rule).toBeInstanceOf(Rule.All);
        });
      });
    });
    describe('Pick', () => {
      describe('constructor', () => {
        it('should create instance', () => {
          const pick = new Rule.Pick(1, 2, 3);
          expect(pick).toBeInstanceOf(Rule.Pick);
        });
        it('should throw error', () => {
          expect(() => {
            new Rule.Pick(0, 1, 2);
          }).toThrowError('Count must be greater than zero');
          expect(() => {
            new Rule.Pick(1, -1, 2);
          }).toThrowError('Min must be greater than or equal to zero');
          expect(() => {
            new Rule.Pick(1, 1, -1);
          }).toThrowError('Max must be greater than or equal to zero');
          expect(() => {
            new Rule.Pick(1, 2, 1);
          }).toThrowError('Max must be greater than or equal to Min');
        });
      });
    });
  });
  describe('SubmissionRequirement', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const submissionRequirement = new SubmissionRequirement(
          Rule.All.readResolve(),
          [new From.FromGroup(new Group('abc'))]
        );
        expect(submissionRequirement).toBeInstanceOf(SubmissionRequirement);
      });
    });
  });
  describe('allGroups', () => {
    it('should return set<Group> when From.FromGroup', () => {
      const sr = new SubmissionRequirement(
        Rule.All.readResolve(),
        new From.FromGroup(new Group('abc'))
      );
      const groups = allGroups(sr);
      expectTypeOf(groups).toEqualTypeOf<Set<Group>>();
      expect(groups.has((sr.from as From.FromGroup).group)).toBe(true);
    });
    it('should return set<Group> when From.FromNested', () => {
      const sr = new SubmissionRequirement(
        Rule.All.readResolve(),
        new From.FromNested([
          new SubmissionRequirement(
            Rule.All.readResolve(),
            new From.FromGroup(new Group('abc'))
          ),
          new SubmissionRequirement(
            Rule.All.readResolve(),
            new From.FromGroup(new Group('def'))
          ),
        ])
      );
      const groups = allGroups(sr);
      expectTypeOf(groups).toEqualTypeOf<Set<Group>>();
      groups.forEach((group) => {
        expect(group.value === 'abc' || group.value === 'def').toBe(true);
      });
    });
    it('should throw error', () => {
      expect(() => {
        allGroups(new SubmissionRequirement(Rule.All.readResolve(), {}));
      }).toThrowError('Unsupported From type');
    });
  });
  describe('InputDescriptorId', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        let id = new InputDescriptorId('abc');
        expect(id).toBeInstanceOf(InputDescriptorId);
        expect(id.value).toBe('abc');
      });
    });
  });
  describe('InputDescriptor', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        let inputDescriptor = new InputDescriptor(
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
        expect(inputDescriptor).toBeInstanceOf(InputDescriptor);
      });
    });
  });

  describe('PresentationSubmission', () => {
    describe('constructor', () => {
      it('should create instance', () => {
        const presentationSubmission = new PresentationSubmission(
          new Id('abc'),
          new Id('def'),
          [
            new DescriptorMap(
              new InputDescriptorId('abc'),
              'abc',
              JsonPath.jsonPath('$.abc')!
            ),
          ]
        );
        expect(presentationSubmission).toBeInstanceOf(PresentationSubmission);
      });
    });
  });
});
