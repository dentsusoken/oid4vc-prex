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
 * Zod schema for validating name values.
 *
 * This schema ensures that a name is a non-empty string.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must have a minimum length of 1 character.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * nameSchema.parse('abc123'); // Returns 'abc123'
 * nameSchema.parse('a'); // Returns 'a'
 *
 * // Invalid usage (will throw ZodError)
 * nameSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * nameSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const nameSchema: z.ZodString = z.string().min(1);

/**
 * Represents a name.
 *
 * A name is a human-friendly value that describes what the object represents.
 *
 * @class
 * @example
 * // Create a Name instance
 * const name = new Name('abc123');
 * console.log(name.value); // Outputs: 'abc123'
 */
export class Name {
  /**
   * Creates an instance of Name.
   *
   * @param {string} value - The value of the name.
   */
  constructor(public value: string) {}
  /**
   * Returns the string representation of the Name.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The name value.
   */
  toJSON(): string {
    return this.value;
  }
}
