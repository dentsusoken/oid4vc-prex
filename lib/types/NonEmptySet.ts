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
 * Create Zod schema for non-empty set
 * This function returns schema ensures a value is a non-empty array.
 *
 * It applies the following validations:
 * - The value must be a array.
 * - The array must have 1 or more items.
 *
 * @template T typeof schema
 * @param {z.ZodType<T, any>} schema Zod schema
 * @returns {z.ZodNonEmptyArray<T>} non-empty set schema
 *
 * @example
 * // Valid usage
 * const itemSchema = z.string();
 * const nonEmptySetSchema = createNonEmptySetSchema(itemSchema);
 * nonEmptySetSchema.parse(['abc123', "def456"]); // Returns ['abc123', "def456"]
 * nonEmptySetSchema.parse(['a']); // Returns ['a']
 *
 * // Invalid usage (will throw ZodError)
 * const itemSchema = z.string();
 * const nonEmptySetSchema = createNonEmptySetSchema(itemSchema);
 * nonEmptySetSchema.parse(''); // Throws error: String must contain at least 1 character(s)
 * nonEmptySetSchema.parse(123); // Throws error: Expected string, received number
 */
export const createNonEmptySetSchema = <T>(schema: z.ZodType<T, any>) =>
  z.array(schema).nonempty();

/**
 * Type of the non-empty set.
 * @template T typeof schema
 *
 *
 * @example
 * const itemSchema = z.string();
 * const nonEmptySetSchema = createNonEmptySetSchema(itemSchema);
 * const nonEmptySet: NonEmptySet<z.infer<typeof itemSchema>> = nonEmptySetSchema.parse(['abc123', 'def456']);
 */
export type NonEmptySet<T> = z.infer<
  z.ZodArray<z.ZodType<T, any, T>, 'atleastone'>
>;
