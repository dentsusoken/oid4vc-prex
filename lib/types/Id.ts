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
 * Zod schema for validating id values.
 *
 * This schema ensures that a id is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * idSchema.parse('abc123'); // Returns 'abc123'
 * idSchema.parse('a'); // Returns 'a'
 *
 * // Invalid usage (will throw ZodError)
 * idSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * idSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const idSchema = z.string().min(1);

/**
 * Represents a id.
 *
 * @class
 * @example
 * // Create a valid Id instance
 * const validId = new Id('abc123');
 * console.log(validId.value); // Outputs: 'abc123'
 *
 */
export class Id {
  /**
   * Creates an instance of Id.
   *
   * @param {string} value - The value of the id.
   */
  constructor(public value: string) {}
  /**
   * Returns the string representation of the Id.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The id value.
   */
  toJSON(): string {
    return this.value;
  }
}
