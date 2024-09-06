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

import { JSONSchema } from '.';
import { z } from 'zod';

/**
 * Zod schema for filter class value.
 *
 * This schema ensures that a value is a valid JSON Schema.
 * It applies the following validations:
 * - The value must be a valid JSON Schema.
 *
 * @type {z.ZodNativeEnum<ClaimFormat>}
 *
 * @example
 * // Valid usage
 * filterSchema.parse({ type: 'string' }); // Returns { type: 'string' }
 *
 * // Invalid usage (will throw ZodError)
 * filterSchema.parse("invalid"); // Throws error: Invalid JSON Schema
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const filterSchema = z
  .record(z.unknown())
  .transform((value) => value as JSONSchema);

/**
 * Represents a filter property of Input Descriptor.
 *
 * @class
 * @example
 * // Create a valid Id instance
 * const filter = new Filter({
 *  type: 'string',
 *  pattern: '^[a-zA-Z0-9-]{1,36}$',
 * });
 * console.log(filter.value); // Outputs: '{"type":"string","pattern":"^[a-zA-Z0-9-]{1,36}$"}'
 *
 */
export class Filter {
  /**
   * Creates a new Filter instance.
   * @param {JSONSchema} value - JSONSchema Object.
   */
  constructor(public value: JSONSchema) {}

  /**
   * Returns the JSONSchema value of the Filter class.
   *
   * @returns {JSONSchema} JSONSchema Object.
   */
  toJSON(): JSONSchema {
    return this.value;
  }

  /**
   * Creates a Format instance from a JSON .
   *
   * @param {JSONSchema} value - JSON Object representation of the JSONSchema.
   * @returns {Filter} Filter object.
   */
  static fromJSON(value: JSONSchema): Filter {
    return new Filter(value);
  }
}
