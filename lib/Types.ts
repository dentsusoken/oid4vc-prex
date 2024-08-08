/*
 * Copyright (c) 2023 European Commission
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Expose, Transform, Type } from 'class-transformer';
import { JsonPathOps } from './JsonPathOps';

export class Id {
  constructor(public value: string) {}
}
export class Name {
  constructor(public value: string) {}
}
export class Purpose {
  constructor(public value: string) {}
}

export type NonEmptySet<T> = T[];

export type JsonObject = Record<string, unknown>;

// TODO implement Formatter
export class Format {
  private constructor(public json: string) {}

  jsonObject(): JsonObject {
    return JSON.parse(this.json);
  }

  static format(json: JsonObject): Format {
    return new Format(JSON.stringify(json));
  }
}

/**
 *  JSONPath string expressions
 */
export class JsonPath {
  private constructor(public value: string) {}

  static jsonPath(s: string): JsonPath | undefined {
    return JsonPathOps.isValid(s) ? new JsonPath(s) : undefined;
  }
}

/**
 * A filter is a [JsonObject] which is expected to contain a
 * JSON Schema definition
 */
export class Filter {
  private constructor(public value: string) {}

  jsonObject(): JsonObject {
    return JSON.parse(this.value);
  }

  static filter(value: JsonObject): Filter {
    return new Filter(JSON.stringify(value));
  }
}

/**
 * [paths]: an array of one or more [JsonPath] expressions
 * (as defined in the JSONPath Syntax Definition section)
 * that select a target value from the input.
 *
 */
export class FieldConstraint {
  @Expose({ name: 'path' })
  //@Type(() => JsonPath)
  @Transform(({ value }) => value.map((v: string) => JsonPath.jsonPath(v)), {
    toClassOnly: true,
  })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  paths?: NonEmptySet<JsonPath>;

  @Transform(({ value }) => new Id(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  id?: Id;

  @Transform(({ value }) => new Name(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  name?: Name;

  @Transform(({ value }) => new Purpose(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  purpose?: Purpose;

  @Transform(({ value }) => Filter.filter(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  filter?: Filter;
  optional?: boolean;

  @Expose({ name: 'intent_to_retain' })
  intentToRetain?: boolean;

  constructor();
  constructor(
    paths: NonEmptySet<JsonPath>,
    id?: Id,
    name?: Name,
    purpose?: Purpose,
    filter?: Filter,
    optional?: boolean,
    intentToRetain?: boolean
  );
  constructor(
    paths?: NonEmptySet<JsonPath>,
    id?: Id,
    name?: Name,
    purpose?: Purpose,
    filter?: Filter,
    optional: boolean = false,
    intentToRetain?: boolean
  ) {
    this.paths = paths;
    this.id = id;
    this.name = name;
    this.purpose = purpose;
    this.filter = filter;
    this.optional = optional;
    this.intentToRetain = intentToRetain;
  }
}

// export class Constraints {
//   fields: FieldConstraint[] = [];

//   constructor() {}
// }

export interface Constraints {}

export class FieldsConstraints implements Constraints {
  @Type(() => FieldConstraint)
  fields: NonEmptySet<FieldConstraint> = [];

  constructor() {}
}

export namespace Constraints {
  export const fields = (instance: Constraints): FieldConstraint[] => {
    if (instance instanceof Fields || instance instanceof FieldsAndDisclosure) {
      return instance.fieldConstraints;
    }
    return [];
  };

  export const limitDisclosure = (
    instance: Constraints
  ): LimitDisclosure | undefined => {
    if (instance instanceof LimitDisclosure) {
      return instance;
    }
    if (instance instanceof FieldsAndDisclosure) {
      return instance.limitDisclosure;
    }
    return undefined;
  };

  /**
   * Conformant Consumer MAY submit a response that contains more than the data described in the fields array.
   */
  export class Fields implements Constraints {
    constructor(public fieldConstraints: NonEmptySet<FieldConstraint>) {
      if (!fieldConstraints || fieldConstraints.length === 0) {
        throw new Error('fieldConstraints is required');
      }
    }
  }
  // TODO prex.Constraints.LimitDisclosureからimportする
  export type LimitDisclosureValue = 'REQUIRED' | 'PREFERRED';

  /**
   * [REQUIRED] This indicates that the Conformant Consumer MUST limit submitted fields to those listed in the fields array (if present). Conformant Consumers are not required to implement support for this value, but they MUST understand this value sufficiently to return nothing (or cease the interaction with the Verifier) if they do not implement it.
   * [PREFERRED]  This indicates that the Conformant Consumer SHOULD limit submitted fields to those listed in the fields array (if present).
   */
  // TODO prex.Constraints.LimitDisclosureからimportする
  export class LimitDisclosure implements Constraints {
    private value?: LimitDisclosureValue;
    static REQUIRED = new LimitDisclosure('REQUIRED');
    static PREFERRED = new LimitDisclosure('PREFERRED');

    private constructor(value: LimitDisclosureValue) {
      this.value = value;
    }

    toString(): LimitDisclosureValue {
      if (!this.value) {
        throw new Error('value is required');
      }
      return this.value;
    }

    static fromString(value: LimitDisclosureValue): LimitDisclosure {
      return new LimitDisclosure(value);
    }
  }

  export class FieldsAndDisclosure implements Constraints {
    constructor(
      public fieldConstraints: NonEmptySet<FieldConstraint>,
      public limitDisclosure: LimitDisclosure
    ) {
      if (!fieldConstraints || fieldConstraints.length === 0) {
        throw new Error('fieldConstraints is required');
      }
    }
  }

  /**
   * Creates a [Constraints] given a [list of field constraints][FieldConstraint] and/or [limitDisclosure]
   */
  export const of = (
    fs?: FieldConstraint[],
    limitDisclosure?: LimitDisclosure
  ): Constraints | undefined => {
    if (fs && fs.length > 0) {
      if (limitDisclosure) {
        return new FieldsAndDisclosure(fs, limitDisclosure);
      }
      if (!limitDisclosure) {
        return new Fields(fs);
      }
    } else if (!fs && limitDisclosure) {
      return limitDisclosure;
    } else {
      return;
    }
  };
}

export class Group {
  constructor(public value: string) {}
}

export interface From {}

export namespace From {
  export class FromGroup implements From {
    constructor(public group: Group) {}
  }
  export class FromNested implements From {
    constructor(public nested: SubmissionRequirement[]) {}
  }
}

export interface Rule {}

export namespace Rule {
  export class All implements Rule {
    private static instance: All;

    private constructor() {}

    public static readResolve(): All {
      if (!All.instance) {
        All.instance = new All();
      }
      return All.instance;
    }
  }

  export class Pick implements Rule {
    constructor(public count: number, public min: number, public max: number) {
      if (count <= 0) {
        throw new Error('Count must be greater than zero');
      }
      if (min < 0) {
        throw new Error('Min must be greater than or equal to zero');
      }
      if (max < 0) {
        throw new Error('Max must be greater than or equal to zero');
      }
      if (max < min) {
        throw new Error('Max must be greater than or equal to Min');
      }
    }
  }
}

export class SubmissionRequirement {
  constructor(
    public rule: Rule,
    public from: From,
    public name?: Name,
    public purpose?: Purpose
  ) {}
}

export const allGroups = (instance: SubmissionRequirement): Set<Group> => {
  if (instance.from && instance.from instanceof From.FromGroup) {
    return new Set<Group>().add(instance.from.group);
  } else if (instance.from instanceof From.FromNested) {
    const groups = instance.from.nested.flatMap(allGroups);
    const set = new Set<Group>();
    groups.forEach((group) => group.forEach((g) => set.add(g)));

    return set;
  }
  throw new Error('Unsupported From type');
};

export class InputDescriptorId {
  constructor(public value: string) {}
}

/**
 * Input Descriptors are objects used to describe the information a Verifier requires of a Holder.
 * It contains an [identifier][Id] and may contain [constraints][Constraints] on data values,
 * and an [explanation][Purpose] why a certain item or set of data is being requested
 */
export class InputDescriptor {
  @Transform(({ value }) => new InputDescriptorId(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  id?: InputDescriptorId;

  @Transform(({ value }) => new Name(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  name?: Name;

  @Transform(({ value }) => new Purpose(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  purpose?: Purpose;

  @Transform(({ value }) => Format.format(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  format?: Format;

  @Type(() => FieldsConstraints)
  constraints?: Constraints;

  @Expose({ name: 'group' })
  groups?: Group[];

  constructor();
  constructor(
    id: InputDescriptorId,
    name: Name | undefined,
    purpose: Purpose | undefined,
    format: Format | undefined,
    constraints: Constraints,
    groups: Group[] | undefined
  );
  constructor(
    id?: InputDescriptorId,
    name?: Name | undefined,
    purpose?: Purpose | undefined,
    format?: Format | undefined,
    constraints?: Constraints,
    groups?: Group[] | undefined
  ) {
    this.id = id;
    this.name = name;
    this.purpose = purpose;
    this.format = format;
    this.constraints = constraints;
    this.groups = groups;
  }
}

/**
 * @param id The Presentation Definition MUST contain an id property.
 * The value of this property MUST be a string.
 * The string SHOULD provide a unique ID for the desired context.
 * For example, a UUID such as 32f54163-7166-48f1-93d8-f f217bdb0653
 * could provide an ID that is unique in a global context,
 * while a simple string such as my_presentation_definition_1 could be suitably unique in a local context
 * @param inputDescriptors The Presentation Definition MUST contain an input_descriptors property.
 * @param name The Presentation Definition MAY contain a name property.
 * If present, its value SHOULD be a human-friendly string intended
 * to constitute a distinctive designation of the Presentation Definition.
 * @param purpose purpose - The Presentation Definition MAY contain a purpose property.
 * If present, its value MUST be a string that describes the purpose for which the Presentation Definition's inputs are being used for.
 *
 */
export class PresentationDefinition {
  @Transform(({ value }) => new Id(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  id?: Id;

  @Transform(({ value }) => new Name(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  name?: Name;

  @Transform(({ value }) => new Purpose(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  purpose?: Purpose;

  @Transform(({ value }) => Format.format(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  format?: Format;

  @Type(() => InputDescriptor)
  @Expose({ name: 'input_descriptors' })
  inputDescriptors?: InputDescriptor[];

  @Expose({ name: 'submission_requirements' })
  submissionRequirements?: SubmissionRequirement[];

  constructor();
  constructor(
    id: Id,
    name: Name | undefined,
    purpose: Purpose | undefined,
    format: Format | undefined,
    inputDescriptors: InputDescriptor[],
    submissionRequirements: SubmissionRequirement[] | undefined
  );
  constructor(
    id?: Id,
    name?: Name | undefined,
    purpose?: Purpose | undefined,
    format?: Format | undefined,
    inputDescriptors?: InputDescriptor[],
    submissionRequirements?: SubmissionRequirement[] | undefined
  ) {
    this.id = id;
    this.inputDescriptors = inputDescriptors;
    this.name = name;
    this.purpose = purpose;
    this.format = format;
    this.submissionRequirements = submissionRequirements;

    /**
     * Make sure that InputDescriptor Ids are unique
     */
    const checkInputDescriptorIds = () => {
      if (!inputDescriptors) {
        return;
      }

      const distinct = new Set();
      inputDescriptors?.forEach((inputDescriptor) => {
        distinct.add(inputDescriptor.id);
      });
      if (distinct.size !== inputDescriptors?.length) {
        throw new Error(
          'InputDescriptor(s) should have PresentationDefinition unique ids'
        );
      }
    };

    /**
     * Input descriptor groups, if present, should be
     * referenced from submission groups
     */
    const checkInputDescriptorGroups = () => {
      if (!submissionRequirements) {
        return;
      }

      const allGroup =
        submissionRequirements?.flatMap((sr) => allGroups(sr)) || [];

      inputDescriptors?.forEach((inputDescriptor) => {
        inputDescriptor.groups?.forEach((grp) => {
          for (const g of allGroup.values()) {
            for (const v of g) {
              if (v.value === grp.value) {
                return;
              }
            }
          }
          throw new Error(
            'Input descriptor ${inputDescriptor.id} ' +
              'contains groups ${grp.value} which is not present in submission requirements'
          );
        });
      });
    };

    checkInputDescriptorIds();
    checkInputDescriptorGroups();
  }
}

export class DescriptorMap {
  id: InputDescriptorId;
  format: string;
  path: JsonPath;

  constructor(id: InputDescriptorId, format: string, path: JsonPath) {
    this.id = id;
    this.format = format;
    this.path = path;
  }
}

export class PresentationSubmission {
  @Transform(({ value }) => new Id(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  id: Id;
  @Expose({ name: 'definition_id' })
  @Transform(({ value }) => new Id(value), { toClassOnly: true })
  @Transform(({ value }) => value.value, { toPlainOnly: true })
  definitionId: Id;
  @Expose({ name: 'descriptor_map' })
  // TODO Confirm whether to return undefined or throw an error when the value is undefined
  @Transform(
    ({ value }) =>
      value.map(
        (v: { id: string; format: string; path: string }) =>
          new DescriptorMap(new Id(v.id), v.format, JsonPath.jsonPath(v.path)!)
      ),
    { toClassOnly: true }
  )
  @Transform(
    ({ value }) =>
      value.map((v: DescriptorMap) => ({
        id: v.id.value,
        format: v.format,
        path: v.path.value,
      })),
    { toPlainOnly: true }
  )
  descriptorMaps: DescriptorMap[];

  constructor(id: Id, definitionId: Id, descriptorMaps: DescriptorMap[]) {
    this.id = id;
    this.definitionId = definitionId;
    this.descriptorMaps = descriptorMaps;
  }
}
