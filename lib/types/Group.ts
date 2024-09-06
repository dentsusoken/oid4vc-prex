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
 * Zod schema for validating group values.
 *
 * This schema ensures that a group is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * groupSchema.parse('abc123'); // Returns 'abc123'
 * groupSchema.parse('a'); // Returns 'a'
 *
 * // Invalid usage (will throw ZodError)
 * groupSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * groupSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const groupSchema = z.string().min(1);

/**
 * Represents a group.
 *
 * @class
 * @example
 * // Create a valid Group instance
 * const validId = new Group('abc123');
 * console.log(validId.value); // Outputs: 'abc123'
 *
 */
export class Group {
  /**
   * Creates an instance of Group.
   *
   * @param {string} value - The value of the group.
   */
  constructor(public value: string) {}
  /**
   * Returns the string representation of the Group.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The group value.
   */
  toJSON(): string {
    return this.value;
  }
}
