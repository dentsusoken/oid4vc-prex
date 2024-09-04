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
import { Id, idSchema } from './Id';
import { DescriptorMap, descriptorMapSchema } from './DescriptorMap';

/**
 * Zod schema for validating presentation submission values.
 *
 * This schema ensures that a presentation submission is an object with the following properties:
 * - id: A valid id.
 * - definition_id: A valid id.
 * - descriptor_map: An array of descriptor maps.
 *
 * @type {z.ZodObject}
 *
 * @example
 * // Valid usage
 * presentationSubmissionSchema.parse({
 *  id: 'abc123',
 *  definition_id: 'def456',
 *  descriptor_map: [{ ... }]
 * }); // Returns { id: 'abc123', definition_id: 'def456', descriptor_map: [{ ... }] }
 *
 * // Invalid usage (will throw ZodError)
 * presentationSubmissionSchema.parse({}); // Throws error: Object has missing required properties
 * presentationSubmissionSchema.parse({ id: 'abc123' }); // Throws error: Object has missing required properties
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const presentationSubmissionSchema = z.object({
  id: idSchema,
  definition_id: idSchema,
  descriptor_map: z.array(descriptorMapSchema),
});

/**
 * Type of a presentation submission JSON object.
 */
export type PresentationSubmissionJSON = z.infer<
  typeof presentationSubmissionSchema
>;

/**
 * Represents a presentation submission.
 *
 * @class
 *
 * @property {Id} id - The id of the presentation submission.
 * @property {Id} definition_id - The id of the presentation definition.
 * @property {DescriptorMap[]} descriptor_map - An array of descriptor maps.
 */
export class PresentationSubmission {
  /**
   * Create a new PresentationSubmission instance.
   *
   * @param {Id} id - The id of the presentation submission.
   * @param {Id} definition_id - The id of the presentation definition.
   * @param {DescriptorMap[]} descriptor_map - An array of descriptor maps.
   */
  constructor(
    public id: Id,
    public definition_id: Id,
    public descriptor_map: DescriptorMap[]
  ) {}

  /**
   * Convert a presentation submission JSON object to a PresentationSubmission instance.
   * @param {PresentationSubmissionJSON} json - The presentation submission JSON object.
   * @returns {PresentationSubmission} A new PresentationSubmission instance.
   */
  static fromJSON(json: PresentationSubmissionJSON): PresentationSubmission {
    return new PresentationSubmission(
      new Id(json.id),
      new Id(json.definition_id),
      json.descriptor_map.map((dm) => DescriptorMap.fromJSON(dm))
    );
  }

  /**
   * Convert this presentation submission instance to a presentation submission JSON object.
   * @returns {PresentationSubmissionJSON} A presentation submission JSON object.
   */
  toJSON(): PresentationSubmissionJSON {
    return presentationSubmissionSchema.parse({
      id: this.id.toJSON(),
      definition_id: this.definition_id.toJSON(),
      descriptor_map: this.descriptor_map.map((dm) => dm.toJSON()),
    });
  }
}
