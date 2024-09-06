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
 * Zod schema for validating purpose values.
 *
 * This schema ensures that a purpose is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * purposeSchema.parse('abc123'); // Returns 'abc123'
 * purposeSchema.parse('a'); // Returns 'a'
 *
 * // Invalid usage (will throw ZodError)
 * purposeSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * purposeSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const purposeSchema: z.ZodString = z.string().min(1);

/**
 * Represents a purpose.
 *
 * A purpose is a value that describes the reason for the object's existence.
 *
 * @class
 * @example
 * // Create a Purpose instance
 * const purpose = new Purpose('abc123');
 * console.log(purpose.value); // Outputs: 'abc123'
 *
 */
export class Purpose {
  /**
   * Creates an instance of Purpose.
   *
   * @param {string} value - The value of the purpose.
   */
  constructor(public value: string) {}
  /**
   * Returns the string representation of the Purpose.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The purpose value.
   */
  toJSON(): string {
    return this.value;
  }
}
