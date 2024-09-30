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
import {
  FieldConstraint,
  FieldConstraintJSON,
  fieldConstraintSchema,
} from './FieldConstraint';
import { NonEmptySet, createNonEmptySetSchema } from './NonEmptySet';

/**
 * Zod schema for a set of FieldConstraints.
 * This schema ensures that a value is a non-empty set of FieldConstraints.
 * It applies the following validations:
 * - The value must be a non-empty set of FieldConstraints.
 * @type {z.ZodNonEmptyArray}
 * @example
 * // Valid usage
 * fieldsSchema.parse([{ path: ['$.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }]); // Returns [{ path: ['$.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }]
 * // Invalid usage (will throw ZodError)
 * fieldsSchema.parse([]); // Throws error: Invalid input
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const fieldsSchema = createNonEmptySetSchema(fieldConstraintSchema);

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
 * Zod schema for Constraints.
 * This schema ensures that a value is a valid Constraints.
 * It applies the following validations:
 * - The value must be an object.
 * - The object may have a fields property.
 * - The fields property must be a non-empty set of FieldConstraints.
 * - The object may have a limitDisclosure property.
 * - The limitDisclosure property must be a valid limit disclosure value.
 * @type {z.ZodObject}
 * @example
 * // Valid usage
 * constraintsSchema.parse({ fields: [{ path: ['$.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }], limitDisclosure: 'required' }); // Returns { fields: [{ path: ['$.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }], limitDisclosure: 'required' }
 * // Invalid usage (will throw ZodError)
 * constraintsSchema.parse({ fields: [], limitDisclosure: 'required' }); // Throws error: Invalid input
 */
export const constraintsSchema = z.object({
  fields: fieldsSchema.optional(),
  limit_disclosure: limitDisclosureSchema.optional(),
}) as z.ZodType<ConstraintsJSON>;

/**
 * Type of a set of FieldConstraint.
 */
export type FieldConstraintSet = NonEmptySet<FieldConstraint>;
/**
 * Type of a set of FieldConstraintJSON.
 */
export type FieldConstraintJSONSet = FieldConstraintJSON[];
/**
 * Type of a limit disclosure value.
 */
export type LimitDisclosureValue = z.infer<typeof limitDisclosureSchema>;
/**
 * Type of a Constraints JSON object.
 */
export type ConstraintsJSON = {
  fields?: FieldConstraintJSONSet;
  limit_disclosure?: LimitDisclosureValue;
};

/**
 * Interface for Constraints.
 * This interface represents the constraints property of Input Descriptor
 * @interface
 */
export interface Constraints {
  readonly __type: 'Fields' | 'LimitDisclosure' | 'FieldsAndDisclosure';
  toJSON(): ConstraintsJSON;
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
     * @param {FieldConstraintJSONSet} fieldConstraints - The JSON object representing the Fields.
     * @returns {Fields} A new Fields instance.
     */
    static fromJSON(fieldsConstraints: FieldConstraintJSONSet): Fields {
      return new Fields(
        fieldsConstraints.map((v) =>
          FieldConstraint.fromJSON(v)
        ) as FieldConstraintSet
      );
    }

    /**
     * Returns the JSON object representation of the Fields.
     * @returns {FieldConstraintJSON[]} The JSON object representation of the Fields.
     */
    toJSON(): ConstraintsJSON {
      return {
        fields: fieldsSchema.parse(
          this.fieldConstraints.map((field) => field.toJSON())
        ),
      };
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
    toJSON(): ConstraintsJSON {
      return { limit_disclosure: this.value };
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

    /**
     * Returns The value of the LimitDisclosure.
     * @returns {LimitDisclosureValue} The value of the LimitDisclosure.
     */
    toJSON(): ConstraintsJSON {
      return {
        limit_disclosure: this.limitDisclosure.value,
        fields: fieldsSchema.parse(
          this.fieldConstraints.map((field) => field.toJSON())
        ),
      };
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
          fs as FieldConstraintSet,
          limitDisclosure
        );
      }
      if (!limitDisclosure) {
        return new Fields(fs as FieldConstraintSet);
      }
    } else if (!fs && limitDisclosure) {
      return limitDisclosure;
    } else {
      return;
    }
  };

  export const fromJSON = (json: ConstraintsJSON): Constraints => {
    if (json.fields && json.limit_disclosure) {
      return new FieldsAndDisclosure(
        json.fields.map((v) =>
          FieldConstraint.fromJSON(v)
        ) as FieldConstraintSet,
        LimitDisclosure.fromString(json.limit_disclosure)
      );
    } else if (json.fields) {
      return new Fields(
        json.fields.map((v) =>
          FieldConstraint.fromJSON(v)
        ) as FieldConstraintSet
      );
    } else if (json.limit_disclosure) {
      return LimitDisclosure.fromString(json.limit_disclosure);
    }
    throw new Error('Invalid Constraints JSON');
  };
}
