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
import { createNonEmptySetSchema } from './NonEmptySet';
import { jsonPathSchema } from './JsonPath';
import { idSchema, Id } from './Id';
import { nameSchema, Name } from './Name';
import { purposeSchema, Purpose } from './Purpose';
import { filterSchema, Filter } from './Filter';
import { JSONSchema } from '.';

/**
 * Zod schema for a path in a FieldConstraint.
 * This schema ensures that a value is a non-empty set of JSON paths.
 * It applies the following validations:
 * - The value must be a non-empty set of JSON paths.
 * @type {z.ZodNonEmptyArray<string>}
 * @example
 * // Valid usage
 * pathSchema.parse(['$.a', '$.b']); // Returns ['$.a', '$.b']
 * // Invalid usage (will throw ZodError)
 * pathSchema.parse(['', '$.a', 123]); // Throws error: Invalid JSON path
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const pathSchema = createNonEmptySetSchema(jsonPathSchema).optional();

/**
 * Zod schema for a FieldConstraint.
 * This schema ensures that a value is a valid FieldConstraint.
 * It applies the following validations:
 * - The value must be an object.
 * - The object may have a path property.
 * - The path property must be a non-empty set of JSON paths.
 * - The object may have an id property.
 * - The id property must be a string.
 * - The object may have a name property.
 * - The name property must be a string.
 * - The object may have a purpose property.
 * - The purpose property must be a string.
 * - The object may have a filter property.
 * - The filter property must be a valid JSON Schema.
 * - The object may have an optional property.
 * - The optional property must be a boolean.
 * - The object may have an intent_to_retain property.
 * - The intent_to_retain property must be a boolean.
 * @type {z.ZodObject}
 * @example
 * // Valid usage
 * fieldConstraintSchema.parse({ path: ['$.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }); // Returns { path: ['$.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }
 * // Invalid usage (will throw ZodError)
 * fieldConstraintSchema.parse({ path: ['.a'], id: '123', name: 'name', purpose: 'purpose', filter: { type: 'string' }, optional: true, intent_to_retain: true }); // Throws error: Invalid JSON path
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const fieldConstraintSchema = z.object({
  path: pathSchema.optional(),
  id: idSchema.optional(),
  name: nameSchema.optional(),
  purpose: purposeSchema.optional(),
  filter: filterSchema.optional(),
  optional: z.boolean().optional(),
  intent_to_retain: z.boolean().optional(),
}) as z.ZodType<FieldConstraintJSON>;

/**
 * Type of a Path.
 */
export type Path = z.infer<typeof pathSchema>;

/**
 * Type of a FieldConstraint JSON object.
 */
export type FieldConstraintJSON = {
  path?: Path;
  id?: string;
  name?: string;
  purpose?: string;
  filter?: JSONSchema;
  optional?: boolean;
  intent_to_retain?: boolean;
};

/**
 * Represents a item of constraints property of Input Descriptor.
 *
 * @class
 * @example
 * // Create a valid Id instance
 * const fieldConstraint = new FieldConstraint(['$.a'], new Id('123'), new Name('name'), new Purpose('purpose'), new Filter({ type: 'string' }), true, true);
 *
 */
export class FieldConstraint {
  /**
   * Creates an instance of FieldConstraint.
   * @param {Path} paths - The path of the FieldConstraint.
   * @param {Id} id - The id of the FieldConstraint.
   * @param {Name} name - The name of the FieldConstraint.
   * @param {Purpose} purpose - The purpose of the FieldConstraint.
   * @param {Filter} filter - The filter of the FieldConstraint.
   * @param {boolean} optional - The optional of the FieldConstraint.
   * @param {boolean} intentToRetain - The intent_to_retain of the FieldConstraint.
   */
  constructor(
    public paths?: Path,
    public id?: Id,
    public name?: Name,
    public purpose?: Purpose,
    public filter?: Filter,
    public optional?: boolean,
    public intentToRetain?: boolean
  ) {}

  /**
   * Creates a FieldConstraint instance from a JSON object.
   *
   * @param {FieldConstraintJSON} json - JSON object representation of the FieldConstraint.
   * @returns {FieldConstraint} A FieldConstraint instance.
   */
  static fromJSON(json: FieldConstraintJSON): FieldConstraint {
    const id = json.id ? new Id(json.id) : undefined;
    const name = json.name ? new Name(json.name) : undefined;
    const purpose = json.purpose ? new Purpose(json.purpose) : undefined;
    const filter = json.filter ? Filter.fromJSON(json.filter) : undefined;

    return new FieldConstraint(
      json.path,
      id,
      name,
      purpose,
      filter,
      json.optional,
      json.intent_to_retain
    );
  }

  /**
   * Returns the JSON representation of the FieldConstraint.
   *
   * @returns {FieldConstraintJSON} JSON object representation of the FieldConstraint.
   */
  toJSON(): FieldConstraintJSON {
    return {
      path: this.paths ? this.paths : undefined,
      id: this.id ? this.id.toJSON() : undefined,
      name: this.name ? this.name.toJSON() : undefined,
      purpose: this.purpose ? this.purpose.toJSON() : undefined,
      filter: this.filter ? this.filter.toJSON() : undefined,
      optional: this.optional,
      intent_to_retain: this.intentToRetain,
    };
  }
}
