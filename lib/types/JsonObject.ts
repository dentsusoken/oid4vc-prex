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
 * Zod schema for validating Json Object values.
 *
 * This schema ensures that a value is a JSON object.
 * It applies the following validations:
 * - The value must be a JSON object.
 * - The object must have string keys and unknown values.
 *
 * @type {z.ZodString}
 *
 * @example
 * // Valid usage
 * jsonObjectSchema.parse({ key: 'value' }); // Returns { key: 'value' }
 * jsonObjectSchema.parse({ key: 123 }); // Returns { key: 123 }
 *
 * // Invalid usage (will throw ZodError)
 * jsonObjectSchema.parse(''); // Throws error: Expected object, received string
 * jsonObjectSchema.parse(123); // Throws error: Expected object, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const jsonObjectSchema = z.record(z.string(), z.unknown());

/**
 * Type of a JSON object.
 */
export type JsonObject = z.infer<typeof jsonObjectSchema>;
