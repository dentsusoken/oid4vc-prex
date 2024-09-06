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

/**
 * Zod schema for validating all values.
 *
 * This schema ensures that the rule is 'all'.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * allSchema.parse({ rule: 'all' }); // Returns { rule: 'all' }
 *
 * // Invalid usage (will throw ZodError)
 * allSchema.parse({ rule: 'pick' }); // Throws error: Invalid input
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const allSchema = z.object({
  rule: z.literal('all'),
});

/**
 * Zod schema for validating pick values.
 *
 * This schema ensures that the rule is 'pick' and that the count, min, and max properties are numbers.
 *
 * @type {z.ZodObject}
 *
 * @example
 * // Valid usage
 * pickSchema.parse({ rule: 'pick', count: 1, min: 0, max: 1 }); // Returns { rule: 'pick', count: 1, min: 0, max: 1 }
 *
 * // Invalid usage (will throw ZodError)
 * pickSchema.parse({ rule: 'pick', count: '1', min: 0, max: 1 }); // Throws error: Invalid input
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const pickSchema = z.object({
  rule: z.literal('pick'),
  count: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

/**
 * Zod discriminated union for validating rule values.
 * This schema ensures that the rule is either 'all' or 'pick'.
 *
 * @type {z.ZodUnion}
 *
 * @example
 * // Valid usage
 * ruleSchema.parse({ rule: 'all' }); // Returns { rule: 'all' }
 * ruleSchema.parse({ rule: 'pick', count: 1, min: 0, max: 1 }); // Returns { rule: 'pick', count: 1, min: 0, max: 1 }
 *
 * // Invalid usage (will throw ZodError)
 * ruleSchema.parse({ rule: 'invalid' }); // Throws error: Invalid input
 * ruleSchema.parse({ rule: 'pick', count: '1', min: 0, max: 1 }); // Throws error: Invalid input
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const ruleSchema = z.discriminatedUnion('rule', [allSchema, pickSchema]);

/**
 * Type of a rule.
 */
export type RuleJSON = z.infer<typeof ruleSchema>;

/**
 * Interface for Rule.
 * This interface represents the rule property of Submission Requirements
 * @interface
 */
export interface Rule {
  readonly __type: 'All' | 'Pick';
  /**
   * Returns the JSON representation of Rule.
   * @returns {RuleJSON}
   */
  toJSON(): RuleJSON;
}

/**
 * Namespace for Rule.
 * @namespace
 */
export namespace Rule {
  /**
   * Returns a Rule instance from a JSON object.
   * @param {RuleJSON} json - The JSON object.
   *
   * @returns {Rule} The Rule instance.
   */
  export const fromJSON = (json: RuleJSON): Rule => {
    switch (json.rule) {
      case 'all':
        return All.readResolve();
      case 'pick':
        return new Pick(json.count, json.min, json.max);
      default:
        throw new Error('Invalid input');
    }
  };

  /**
   * Represents the 'all' rule.
   * @class
   */
  export class All implements Rule {
    readonly __type = 'All' as const;
    private static instance: All;

    /**
     * Private constructor for All.
     */
    private constructor() {}

    /**
     * Returns the instance of All.
     * @returns {All}
     */
    static readResolve(): All {
      if (!All.instance) {
        All.instance = new All();
      }
      return All.instance;
    }

    /**
     * Returns the JSON representation of All.
     * @returns {RuleJSON}
     */
    toJSON(): RuleJSON {
      return {
        rule: 'all',
      };
    }
  }

  /**
   * Represents the 'pick' rule.
   * @class
   */
  export class Pick implements Rule {
    readonly __type = 'Pick' as const;

    /**
     * Constructor for Pick.
     * @param {number} count - The number of requirements to pick.
     * @param {number} min - The minimum number of requirements to pick.
     * @param {number} max - The maximum number of requirements to pick.
     */
    constructor(
      public count?: number,
      public min?: number,
      public max?: number
    ) {
      if (count && count <= 0) {
        throw new Error('Count must be greater than zero');
      }
      if (min && min < 0) {
        throw new Error('Min must be greater than or equal to zero');
      }
      if (max && max < 0) {
        throw new Error('Max must be greater than or equal to zero');
      }
      if (min && max && max < min) {
        throw new Error('Max must be greater than or equal to Min');
      }
    }

    /**
     * Returns the JSON representation of Pick.
     * @returns {RuleJSON}
     */
    toJSON(): RuleJSON {
      return {
        rule: 'pick',
        count: this.count,
        min: this.min,
        max: this.max,
      };
    }
  }
}
