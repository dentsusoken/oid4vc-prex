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

import { z } from 'zod';
import { FieldConstraint, FieldConstraintJSON } from './FieldConstraint';
import { createNonEmptySetSchema } from './NonEmptySet';

/**
 * Zod schema for a set of FieldConstraints.
 * This schema ensures that a value is a non-empty set of FieldConstraints.
 * It applies the following validations:
 * - The value must be a non-empty set of FieldConstraints.
 * @type {z.ZodNonEmptyArray<FieldConstraint>}
 * @example
 * // Valid usage
 * fieldConstraintsSchema.parse([new FieldConstraint('$.a'), new FieldConstraint('$.b')]); // Returns [FieldConstraint, FieldConstraint]
 * // Invalid usage (will throw ZodError)
 * fieldConstraintsSchema.parse([]); // Throws error: Invalid input
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const fieldConstraintsSchema = createNonEmptySetSchema(
  z.instanceof(FieldConstraint)
);

/**
 * Zod schema for a limit disclosure value.
 * This schema ensures that a value is a valid limit disclosure value.
 * It applies the following validations:
 * - The value must be either 'required' or 'preferred'.
 * @type {z.ZodEnum}
 * @example
 * // Valid usage
 * limitDisclosureSchema.parse('required'); // Returns 'required'
 * limitDisclosureSchema.parse('preferred'); // Returns 'preferred'
 * // Invalid usage (will throw ZodError)
 * limitDisclosureSchema.parse(''); // Throws error: Invalid enum member
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const limitDisclosureSchema = z.enum(['required', 'preferred']);

/**
 * Interface for Constraints.
 * This interface represents the constraints property of Input Descriptor
 * @interface
 */
export interface Constraints {
  readonly __type:
    | 'FieldsConstraints'
    | 'Fields'
    | 'LimitDisclosure'
    | 'FieldsAndDisclosure';
}

/**
 * Type of a set of FieldConstraints.
 */
export type FieldConstraintSet = z.infer<typeof fieldConstraintsSchema>;
/**
 * Type of a limit disclosure value.
 */
export type LimitDisclosureValue = z.infer<typeof limitDisclosureSchema>;

/**
 * Represents a set of constraints for the Input Descriptor.
 * It contains a set of FieldConstraints.
 * @class
 * @implements {Constraints}
 * @param {FieldConstraintSet} fields - The set of FieldConstraints.
 * @example
 * // Create a new FieldsConstraints
 * const fieldsConstraints = new FieldsConstraints([new FieldConstraint('$.a'), new FieldConstraint('$.b')]);
 */
export class FieldsConstraints implements Constraints {
  readonly __type = 'FieldsConstraints' as const;

  /**
   * Creates an instance of FieldsConstraints.
   * @param {FieldConstraintSet} fields - The set of FieldConstraints.
   */
  constructor(public fields: FieldConstraintSet) {}

  /**
   * Creates an instance of FieldsConstraints.
   * @param {FieldConstraintSet} fieldsConstraints - The JSON object representing the FieldsConstraints.
   * @returns {FieldsConstraints} A new FieldsConstraints instance.
   */
  static fromJSON(fieldsConstraints: FieldConstraintSet): FieldsConstraints {
    return new FieldsConstraints(fieldsConstraints);
  }

  /**
   * Returns the JSON object representation of the FieldsConstraints.
   * @returns {FieldConstraintJSON[]} The JSON object representation of the FieldsConstraints.
   */
  toJSON(): FieldConstraintJSON[] {
    return this.fields.map((field) => field.toJSON());
  }
}

/**
 * Namespace for Constraints.
 * It contains classes and functions for Constraints.
 * @namespace
 */
export namespace Constraints {
  /**
   * Represents a fields propertiy for the Constraints.
   * It contains a set of FieldConstraint.
   * @class
   * @implements {Constraints}
   * @param {FieldConstraintSet} fieldConstraints - The set of FieldConstraint.
   * @example
   * // Create a new Fields instance
   * const fields = new Fields([new FieldConstraint('$.a'), new FieldConstraint('$.b')]);
   */
  export class Fields implements Constraints {
    readonly __type = 'Fields' as const;

    /**
     * Creates an instance of Fields.
     * @param {FieldConstraintSet} fieldConstraints - The set of FieldConstraints.
     * @throws {Error} Thrown when fieldConstraints is undefined or empty.
     */
    constructor(public fieldConstraints: FieldConstraintSet) {
      if (!fieldConstraints || fieldConstraints.length === 0) {
        throw new Error('fieldConstraints is required');
      }
    }

    /**
     * Creates an instance of Fields from a JSON object.
     * @param {FieldConstraintSet} fieldConstraints - The JSON object representing the Fields.
     * @returns {Fields} A new Fields instance.
     */
    static fromJSON(fieldConstraints: FieldConstraintSet): Fields {
      return new Fields(fieldConstraints);
    }

    /**
     * Returns the JSON object representation of the Fields.
     * @returns {FieldConstraintJSON[]} The JSON object representation of the Fields.
     */
    toJSON(): FieldConstraintJSON[] {
      return this.fieldConstraints.map((field) => field.toJSON());
    }
  }

  /**
   * Represents a limit_disclosure propertiy for the Constraints.
   * It contains a value that can be either 'required' or 'preferred'.
   * @class
   * @implements {Constraints}
   * @param {LimitDisclosureValue} value - The value of the LimitDisclosure.
   * @example
   * // Create a new LimitDisclosure instance
   * const limitDisclosure = LimitDisclosure.REQUIRED;
   */
  export class LimitDisclosure implements Constraints {
    readonly __type = 'LimitDisclosure' as const;
    /**
     * The required limit disclosure value.
     * @type {LimitDisclosure}
     * @static
     */
    static REQUIRED = new LimitDisclosure('required');
    /**
     * The preferred limit disclosure value.
     * @type {LimitDisclosure}
     * @static
     */
    static PREFERRED = new LimitDisclosure('preferred');

    /**
     * Creates an instance of LimitDisclosure.
     * @param {LimitDisclosureValue} value - The value of the LimitDisclosure.
     * @private
     */
    private constructor(public value: LimitDisclosureValue) {
      this.value = value;
    }

    /**
     * Returns The value of the LimitDisclosure.
     * @returns {LimitDisclosureValue} The value of the LimitDisclosure.
     */
    toJSON() {
      return this.value;
    }

    /**
     * Creates a LimitDisclosure instance from a string.
     * @param {string} value - The string value of the LimitDisclosure.
     * @returns {LimitDisclosure} A LimitDisclosure instance.
     */
    static fromString(value: string): LimitDisclosure {
      switch (value) {
        case 'required':
          return LimitDisclosure.REQUIRED;
        case 'preferred':
          return LimitDisclosure.PREFERRED;
        default:
          throw new Error(`Invalid LimitDisclosure value: ${value}`);
      }
    }
  }

  /**
   * Represents a set of fields and a limit disclosure value for the Constraints.
   * It contains a set of FieldConstraints and a limit disclosure value.
   * @class
   * @implements {Constraints}
   * @param {FieldConstraintSet} fieldConstraints - The set of FieldConstraints.
   * @param {LimitDisclosure} limitDisclosure - The limit disclosure value.
   * @example
   * // Create a new FieldsAndDisclosure instance
   * const fieldsAndDisclosure = new FieldsAndDisclosure([new FieldConstraint('$.a'), new FieldConstraint('$.b')], LimitDisclosure.REQUIRED);
   */
  export class FieldsAndDisclosure implements Constraints {
    readonly __type = 'FieldsAndDisclosure' as const;
    /**
     * Creates an instance of FieldsAndDisclosure.
     * @param {FieldConstraintSet} fieldConstraints - The set of FieldConstraints.
     * @param {LimitDisclosure} limitDisclosure - The limit disclosure value.
     * @throws {Error} Thrown when fieldConstraints is undefined or empty.
     */
    constructor(
      public fieldConstraints: FieldConstraintSet,
      public limitDisclosure: LimitDisclosure
    ) {
      if (!fieldConstraints || fieldConstraints.length === 0) {
        throw new Error('fieldConstraints is required');
      }
    }
  }

  /**
   * Returns the FieldConstraints of the Constraints.
   * @param {Constraints} instance - The Constraints instance.
   * @returns {FieldConstraint[]} The FieldConstraints of the Constraints.
   */
  export const fields = (instance: Constraints): FieldConstraint[] => {
    const type = instance.__type;
    if (type === 'Fields' || type === 'FieldsAndDisclosure') {
      return (instance as Fields | FieldsAndDisclosure).fieldConstraints;
    }
    return [];
  };

  /**
   * Returns the LimitDisclosure of the Constraints.
   * @param {Constraints} instance - The Constraints instance.
   * @returns {LimitDisclosure} The LimitDisclosure of the Constraints.
   */
  export const limitDisclosure = (
    instance: Constraints
  ): LimitDisclosure | undefined => {
    const type = instance.__type;
    if (type === 'LimitDisclosure') {
      return instance as LimitDisclosure;
    }
    if (type === 'FieldsAndDisclosure') {
      return (instance as FieldsAndDisclosure).limitDisclosure;
    }
    return undefined;
  };

  /**
   * Returns a Constraints instance.
   * @param {FieldConstraintJSON[]} fs - An array of FieldConstraint instance.
   * @param {LimitDisclosure} limitDisclosure - The LimitDisclosure instance.
   * @returns {Constraints} A Constraints instance.
   */
  export const of = (
    fs?: FieldConstraint[],
    limitDisclosure?: LimitDisclosure
  ): Constraints | undefined => {
    if (fs && fs.length > 0) {
      if (limitDisclosure) {
        return new FieldsAndDisclosure(
          fieldConstraintsSchema.parse(fs),
          limitDisclosure
        );
      }
      if (!limitDisclosure) {
        return new Fields(fieldConstraintsSchema.parse(fs));
      }
    } else if (!fs && limitDisclosure) {
      return limitDisclosure;
    } else {
      return;
    }
  };
}
