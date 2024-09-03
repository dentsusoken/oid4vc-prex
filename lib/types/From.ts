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
  SubmissionRequirement,
  SubmissionRequirementJSON,
  submissionRequirementSchema,
} from './SubmissionRequirement';
import { Group } from './Group';

/**
 * Zod schema for the from property of Submission Requirements
 *
 * This schema ensures that a value is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * fromGroupSchema.parse('issuer'); // Returns 'issuer'
 *
 * // Invalid usage (will throw ZodError)
 * fromGroupSchema.parse(''); // Throws error: Expected string to have a minimum length of 1, received empty string
 * fromGroupSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const fromGroupSchema = z.string().min(1);

/**
 * Zod schema for the from_nested property of Submission Requirements
 *
 * This schema ensures that a value is an array of SubmissionRequirementJSON objects.
 * It applies the following validations:
 * - The value must be an array.
 * - The array must contain SubmissionRequirementJSON objects.
 *
 * @type {z.ZodArray<z.ZodType<SubmissionRequirementJSON>>}
 *
 * @example
 * // Valid usage
 * fromNestedSchema.parse([{ "from": "issuer" }]); // Returns [{ "from": "issuer" }]
 *
 * // Invalid usage (will throw ZodError)
 * fromNestedSchema.parse([{ "from": "issuer" }, { "from": "subject" }]); // Throws error: Invalid SubmissionRequirement
 * fromNestedSchema.parse([{ "from": "issuer" }, { "from_nested": [{ "from": "subject" }] }]); // Throws error: Invalid SubmissionRequirement
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const fromNestedSchema: z.ZodType<SubmissionRequirementJSON[]> = z.lazy(
  () => z.array(submissionRequirementSchema)
);

/**
 * Zod schema for validating FromJSON values.
 * This schema ensures that a value is an object with optional 'from' and 'from_nested' properties.
 * - 'from' must be a non-empty string or undefined.
 * - 'from_nested' must be an array of SubmissionRequirementJSON objects or undefined.
 *
 * @type {z.ZodObject<{ from: z.ZodString; from_nested: z.ZodArray<z.ZodType<SubmissionRequirementJSON>> }>}
 *
 * @example
 * // Valid usage
 * fromSchema.parse({ from: 'issuer' }); // Returns { from: 'issuer' }
 * fromSchema.parse({ from_nested: [{ "from": "issuer" }] }); // Returns { from_nested: [{ "from": "issuer" }] }
 *
 * // Invalid usage (will throw ZodError)
 * fromSchema.parse({ from: 'issuer', from_nested: [{ "from": "issuer" }] }); // Throws error: From and FromNested cannot be defined at the same time
 * fromSchema.parse({}); // Throws error: From or FromNested must be defined
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const fromSchema = z
  .object({
    from: fromGroupSchema.optional(),
    from_nested: fromNestedSchema.optional(),
  })
  .refine((data) => {
    if (!data.from && !data.from_nested) {
      return false;
    }
    if (data.from && data.from_nested) {
      return false;
    }
    return true;
  });

/**
 * Type of from / from_nested JSON object.
 */
export type FromJSON = z.infer<typeof fromSchema>;

/**
 * Interface for From.
 * This interface represents the from or from_nested property of Submission Requirements
 * @interface
 */
export interface From {
  readonly __type: 'FromGroup' | 'FromNested';
  /**
   * Returns the JSON representation of the From object.
   * @returns {FromJSON} JSON representation of the From object.
   */
  toJSON(): FromJSON;
}

/**
 * Namespace for From
 * @namespace
 */
export namespace From {
  /**
   * Creates a new From object from a JSON object.
   * @param {FromJSON}
   * @returns {From} From object created from the JSON object.
   * @throws {Error} Throws an error if the JSON object is invalid.
   */
  export const fromJSON = (json: FromJSON): From => {
    if (!json.from && !json.from_nested) {
      throw new Error('From or FromNested must be defined');
    }
    if (json.from && json.from_nested) {
      throw new Error('From and FromNested cannot be defined at the same time');
    }
    if (json.from) {
      return new FromGroup(new Group(json.from));
    }
    if (json.from_nested) {
      return new FromNested(
        json.from_nested.map((v) => SubmissionRequirement.fromJSON(v))
      );
    }
    throw new Error('Invalid From');
  };

  /**
   * Represents the from property of Submission Requirements
   * @class
   * @implements {From}
   * @param {Group} group - The group instance.
   */
  export class FromGroup implements From {
    readonly __type = 'FromGroup' as const;

    /**
     * Creates a new FromGroup object.
     * @param group - The group instance.
     */
    constructor(public group: Group) {}

    /**
     * Returns the JSON representation of the From object.
     * @returns {FromJSON} JSON representation of the From object.
     */
    toJSON(): FromJSON {
      return { from: this.group.value };
    }
  }

  /**
   * Represents the from_nested property of Submission Requirements
   * @class
   * @implements {From}
   * @param {SubmissionRequirement[]} nested - The nested value of the From object.
   */
  export class FromNested implements From {
    readonly __type = 'FromNested' as const;

    /**
     * Creates a new FromNested object.
     * @param nested - The array of SubmissionRequirement instance.
     */
    constructor(public nested: SubmissionRequirement[]) {}
    /**
     * Returns the JSON representation of the From object.
     * @returns {FromJSON} JSON representation of the From object.
     */
    toJSON(): FromJSON {
      return { from_nested: this.nested.map((v) => v.toJSON()) };
    }
  }
}
