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
import { JsonPathOps } from '../JsonPathOps';

/**
 * Zod schema for validating JSONPath values.
 *
 * This schema ensures that a JSONPath is a string starting with '$'.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must start with '$'.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * jsonPathSchema.parse('$.abc123'); // Returns '$.abc123'
 * jsonPathSchema.parse('$[0]'); // Returns '$[0]'
 *
 * // Invalid usage (will throw ZodError)
 * jsonPathSchema.parse('abc123'); // Throws error: Invalid JSONPath
 * jsonPathSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const jsonPathSchema = z
  .string()
  .refine((v: string) => JsonPathOps.isValid(v));

/**
 * Represents a JSON Path.
 *
 * A JSON Path is a string that describes the path to a JSON value.
 *
 * @class
 * @example
 * // Create a valid JsonPath instance
 *  const jsonPathValue = jsonPathSchema.parse('$.abc123');
 */
export class JsonPath {
  /**
   * Creates an instance of JsonPath.
   *
   * @param {string} value The JSON Path value
   */
  private constructor(public value: string) {}

  /**
   * Creates an instance of JsonPath from string.
   *
   * @param {string} value The JSON Path value
   * @returns {JsonPath | undefined} The JsonPath instance or undefined if the input is invalid.
   */
  static fromString(s: string): JsonPath | undefined {
    return jsonPathSchema.safeParse(s).success ? new JsonPath(s) : undefined;
  }

  /**
   * Returns the string representation of the JsonPath.
   *
   * This method is used for JSON serialization.
   *
   * @returns {string} The JSON Path value.
   */
  toJSON(): string {
    return this.value;
  }
}
