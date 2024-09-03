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
import { Rule, RuleJSON, ruleSchema } from './Rule';
import { From, fromSchema } from './From';
import { Name, nameSchema } from './Name';
import { Purpose, purposeSchema } from './Purpose';

/**
 * Zod schema for validating submission requirement values.
 *
 * This schema ensures that a submission requirement is an object with the following properties:
 * - rule: A string that must be either 'all' or 'pick'.
 * - name: An optional string.
 * - purpose: An optional string.
 * - from: An optional string.
 * - from_nested: An optional array of submission requirement objects.
 * - count: An optional number.
 * - min: An optional number.
 * - max: An optional number.
 *
 * @type {z.ZodObject}
 *
 * @example
 * // Valid usage
 * submissionRequirementSchema.parse({
 *  rule: 'all',
 *  name: 'name',
 *  purpose: 'purpose',
 *  from: 'from',
 * }); // Returns { rule: 'all', name: 'name', purpose: 'purpose', from: 'from'}
 *
 * // Invalid usage (will throw ZodError)
 * submissionRequirementSchema.parse({}); // Throws error: Object has missing required properties
 */
export const submissionRequirementSchema = z.lazy(() =>
  z
    .object({
      name: nameSchema.optional(),
      purpose: purposeSchema.optional(),
      // ...fromSchema.shape,
    })
    .and(ruleSchema)
    .and(fromSchema)
);

/**
 * Type of a submission requirement.
 */
export type SubmissionRequirementJSON = {
  name?: string | undefined;
  purpose?: string | undefined;
  from?: string | undefined;
  from_nested?: SubmissionRequirementJSON[] | undefined;
} & RuleJSON;

/**
 * Represents a submission requirement.
 * @class
 *
 * @example
 * // Create a valid SubmissionRequirement instance
 * const validSubmissionRequirement = new SubmissionRequirement(
 *  new Rule.Pick(1, 1, 1),
 *  new From.FromGroup(new Group('group')),
 *  new Name('name'),
 *  new Purpose('purpose')
 * );
 */
export class SubmissionRequirement {
  constructor(
    public rule: Rule,
    public from: From,
    public name?: Name,
    public purpose?: Purpose
  ) {}

  /**
   * Creates an instance of SubmissionRequirement.
   * @param {SubmissionRequirementJSON} json - the JSON representation of the SubmissionRequirement.
   * @returns {SubmissionRequirement} A submission requirement instance.
   */
  static fromJSON(json: SubmissionRequirementJSON): SubmissionRequirement {
    if ((!json.from && !json.from_nested) || (json.from && json.from_nested)) {
      throw new Error('From or FromNested must be defined');
    }
    const rule = Rule.fromJSON(json);
    const from = From.fromJSON(json);
    const name = json.name ? new Name(json.name) : undefined;
    const purpose = json.purpose ? new Purpose(json.purpose) : undefined;
    return new SubmissionRequirement(rule, from, name, purpose);
  }

  /**
   * Returns the JSON representation of the SubmissionRequirement.
   *
   * This method is used for JSON serialization.
   *
   * @returns {SubmissionRequirementJSON} The submission requirement JSON.
   */
  toJSON(): SubmissionRequirementJSON {
    return {
      name: this.name?.toJSON(),
      purpose: this.purpose?.toJSON(),
      ...this.from.toJSON(),
      ...this.rule.toJSON(),
    };
  }
}

/**
 * Namespace for SubmissionRequirement.
 * @namespace
 */
export namespace SubmissionRequirement {
  /**
   * Returns all unique groups in the submission requirement.
   * @param {SubmissionRequirement} instance - The submission requirement instance.
   * @returns {Set<string>} A set of groups.
   */
  export const allGroups = (instance: SubmissionRequirement): Set<string> => {
    if (instance.from.__type === 'FromGroup') {
      return new Set([(instance.from as From.FromGroup).group.value]);
    } else if (instance.from.__type === 'FromNested') {
      return (instance.from as From.FromNested).nested
        .flatMap((v) => SubmissionRequirement.allGroups(v))
        .reduce((acc, set) => new Set([...acc, ...set]), new Set());
    } else {
      throw new Error('Unsupported From type');
    }
  };
}
