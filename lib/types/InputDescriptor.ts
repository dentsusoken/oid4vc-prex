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
  inputDescriptorIdSchema,
  InputDescriptorId,
} from './InputDescriptorId';
import { Name, nameSchema } from './Name';
import { Purpose, purposeSchema } from './Purpose';
import { Format, formatSchema } from './Format';
import { Constraints, constraintsSchema } from './Constraints';
import { Group, groupSchema } from './Group';

/**
 * Zod schema for InputDescriptor
 * @type {z.ZodObject}
 * @property {string} id
 * @property {string} name
 * @property {string} purpose
 * @property {FormatJSON} format
 * @property {ConstraintsJSON} constraints
 * @property {string[]} group
 */
export const inputDescriptorSchema = z.object({
  id: inputDescriptorIdSchema,
  name: nameSchema.optional(),
  purpose: purposeSchema.optional(),
  format: formatSchema.optional(),
  constraints: constraintsSchema,
  group: z.array(groupSchema).optional(),
});

/**
 * Type of InputDescriptor JSON
 */
export type InputDescriptorJSON = z.infer<typeof inputDescriptorSchema>;

/**
 * Represents an InputDescriptor
 * @class
 * @property {InputDescriptorId} id
 * @property {Name} name
 * @property {Purpose} purpose
 * @property {Format} format
 * @property {Constraints} constraints
 * @property {Group[]} groups
 */
export class InputDescriptor {
  /**
   * Constructor for InputDescriptor
   * @property {InputDescriptorId} id
   * @property {Name} name
   * @property {Purpose} purpose
   * @property {Format} format
   * @property {Constraints} constraints
   * @property {Group[]} groups
   */
  constructor(
    public id: InputDescriptorId,
    public name: Name | undefined,
    public purpose: Purpose | undefined,
    public format: Format | undefined,
    public constraints: Constraints,
    public groups: Group[] | undefined
  ) {}

  /**
   * Converts JSON to InputDescriptor
   * @param {InputDescriptorJSON} json
   * @returns {InputDescriptor}
   */
  static fromJson(json: InputDescriptorJSON): InputDescriptor {
    return new InputDescriptor(
      new InputDescriptorId(json.id),
      json.name ? new Name(json.name) : undefined,
      json.purpose ? new Purpose(json.purpose) : undefined,
      json.format ? Format.fromJSON(json.format) : undefined,
      Constraints.fromJSON(json.constraints),
      json.group ? json.group.map((group) => new Group(group)) : undefined
    );
  }

  /**
   * Converts InputDescriptor to JSON
   * @returns {InputDescriptorJSON}
   */
  toJSON(): InputDescriptorJSON {
    return {
      id: this.id.toJSON(),
      name: this.name?.value,
      purpose: this.purpose?.value,
      format: this.format?.toJSON(),
      constraints: this.constraints.toJSON(),
      group: this.groups?.map((group) => group.toJSON()),
    };
  }
}
