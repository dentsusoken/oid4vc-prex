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
import {
  InputDescriptorId,
  inputDescriptorIdSchema,
} from './InputDescriptorId';
import { JsonPath, jsonPathSchema } from './JsonPath';

/**
 * Zod schema for validating descriptor map values.
 *
 * This schema ensures that a descriptor map is an object with the following properties:
 * - id: an InputDescriptorId
 * - format: a string
 * - path: a JSONPath
 * - path_nested: an optional nested descriptor map
 *
 * @type {z.ZodObject}
 *
 * @example
 * // Valid usage
 * descriptorMapSchema.parse({
 *  id: '123',
 *  format: 'json',
 *  path: '$.abc123',
 *  path_nested: {
 *   id: '456',
 *   format: 'json',
 *   path: '$.def456'
 * }
 * }); // Returns { id: '123', format: 'json', path: '$.abc123', path_nested: { id: '456', format: 'json', path: '$.def456' } }
 *
 * // Invalid usage (will throw ZodError)
 * descriptorMapSchema.parse({
 *  id: '123',
 *  format: 'json',
 *  path: '$.abc123',
 *  path_nested: {
 *   id: '456',
 *   format: 'json',
 *   path: 'def456'
 * }
 * }); // Throws error: Invalid JSONPath
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const descriptorMapSchema: z.ZodType<DescriptorMapJSON> = z.lazy(() =>
  z.object({
    id: inputDescriptorIdSchema,
    format: z.string(),
    path: jsonPathSchema,
    path_nested: descriptorMapSchema.optional(),
  })
);

/**
 * Type of a descriptor map JSON object.
 */
export type DescriptorMapJSON = {
  id: string;
  format: string;
  path: string;
  path_nested?: DescriptorMapJSON;
};

/**
 * Represents a descriptor map.
 * A descriptor map is an object that describes the path to a JSON value.
 *
 * @class
 *
 * @param {InputDescriptorId} id The input descriptor ID
 * @param {string} format The format of the JSON value
 * @param {JsonPath} path The JSON path to the value
 * @param {DescriptorMap} pathNested An optional nested descriptor map
 *
 */
export class DescriptorMap {
  /**
   * Constructor for DescriptorMap
   * @param {InputDescriptorId} id
   * @param {string} format
   * @param {JsonPath} path
   * @param {DescriptorMap} pathNested
   */
  constructor(
    public id: InputDescriptorId,
    public format: string,
    public path: JsonPath,
    public pathNested?: DescriptorMap
  ) {}

  /**
   * Converts JSON to DescriptorMap
   * @param {DescriptorMapJSON} json
   * @returns {DescriptorMap}
   */
  static fromJSON(json: DescriptorMapJSON): DescriptorMap {
    const path = JsonPath.fromString(json.path);
    if (!path) {
      throw new Error('Invalid JSON path');
    }
    return new DescriptorMap(
      new InputDescriptorId(json.id),
      json.format,
      path,
      json.path_nested ? DescriptorMap.fromJSON(json.path_nested) : undefined
    );
  }

  /**
   * Converts DescriptorMap to JSON
   * @returns {DescriptorMapJSON}
   */
  toJSON(): DescriptorMapJSON {
    return {
      id: this.id.toJSON(),
      format: this.format,
      path: this.path.toJSON(),
      path_nested: this.pathNested?.toJSON(),
    };
  }
}
