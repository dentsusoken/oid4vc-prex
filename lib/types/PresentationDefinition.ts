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
import { Name, nameSchema } from './Name';
import { Purpose, purposeSchema } from './Purpose';
import { Format, FormatJSON, formatSchema } from './Format';
import {
  InputDescriptor,
  InputDescriptorJSON,
  inputDescriptorSchema,
} from './InputDescriptor';
import {
  SubmissionRequirement,
  SubmissionRequirementJSON,
  submissionRequirementSchema,
} from './SubmissionRequirement';

/**
 * Zod schema for validating presentation definition values.
 *
 * This schema ensures that a presentation definition is an object with the following properties:
 * - id: The value must be a string.
 * - name: An optional string.
 * - purpose: An optional string.
 * - format: An optional object that must be an instance of Format.
 * - input_descriptors: An optional array of objects that must be InputDescriptor json.
 * - submission_requirements: An optional array of objects that must be SubmissionRequirement json.
 */
export const presentationDefinitionSchema = z.object({
  id: idSchema,
  name: nameSchema.optional(),
  purpose: purposeSchema.optional(),
  format: formatSchema.optional(),
  input_descriptors: z.array(inputDescriptorSchema).optional(),
  submission_requirements: z.array(submissionRequirementSchema).optional(),
}) as z.ZodType<PresentationDefinitionJSON>;

/**
 * Type of a PresentationDefinition JSON object.
 */
export type PresentationDefinitionJSON = {
  id: string;
  name?: string;
  purpose?: string;
  format?: FormatJSON;
  input_descriptors?: InputDescriptorJSON[];
  submission_requirements?: SubmissionRequirementJSON[];
};

/**
 * Represents a presentation definition.
 *
 * @class
 * @property {Id} id The id of the presentation definition.
 * @property {Name} [name] The name of the presentation definition.
 * @property {Purpose} [purpose] The purpose of the presentation definition.
 * @property {Format} [format] The format of the presentation definition.
 * @property {InputDescriptor[]} [inputDescriptors] The input descriptors of the presentation definition.
 * @property {SubmissionRequirement[]} [submissionRequirements] The submission requirements of the presentation definition.
 */
export class PresentationDefinition {
  /**
   * Creates a new PresentationDefinition instance.
   * @property {Id} id The id of the presentation definition.
   * @property {Name} [name] The name of the presentation definition.
   * @property {Purpose} [purpose] The purpose of the presentation definition.
   * @property {Format} [format] The format of the presentation definition.
   * @property {InputDescriptor[]} [inputDescriptors] The input descriptors of the presentation definition.
   * @property {SubmissionRequirement[]} [submissionRequirements] The submission requirements of the presentation definition.
   */
  public constructor(
    public id: Id,
    public name?: Name,
    public purpose?: Purpose,
    public format?: Format,
    public inputDescriptors?: InputDescriptor[],
    public submissionRequirements?: SubmissionRequirement[]
  ) {
    /**
     * Make sure that InputDescriptor Ids are unique
     */
    const checkInputDescriptorIds = () => {
      if (!inputDescriptors) {
        return;
      }
      const distinct = new Set(
        inputDescriptors.map((inputDescriptor) => inputDescriptor.id)
      );
      if (distinct.size !== inputDescriptors?.length) {
        throw new Error(
          'InputDescriptor(s) should have PresentationDefinition unique ids'
        );
      }
    };
    /**
     * Input descriptor groups, if present, should be
     * referenced from submission groups
     */
    const checkInputDescriptorGroups = () => {
      if (!submissionRequirements) {
        return;
      }
      const allGroup = new Set(
        ...submissionRequirements?.flatMap((sr) =>
          SubmissionRequirement.allGroups(sr)
        )
      );
      inputDescriptors?.forEach((inputDescriptor) => {
        inputDescriptor.groups?.forEach((group) => {
          if (!allGroup.has(group.value)) {
            throw new Error(
              `Input descriptor ${inputDescriptor.id} 
                contains groups ${group.value} which is not present in submission requirements`
            );
          }
        });
      });
    };

    checkInputDescriptorIds();
    checkInputDescriptorGroups();
  }

  /**
   * Convert a presentation definition JSON object to a PresentationDefinition instance.
   * @returns {PresentationDefinitionJSON} A presentation definition JSON object.
   */
  public toJSON(): PresentationDefinitionJSON {
    return {
      id: this.id.value,
      name: this.name?.value,
      purpose: this.purpose?.value,
      format: this.format?.toJSON(),
      input_descriptors: this.inputDescriptors?.map((inputDescriptor) =>
        inputDescriptor.toJSON()
      ),
      submission_requirements: this.submissionRequirements?.map(
        (submissionRequirement) => submissionRequirement.toJSON()
      ),
    };
  }

  /**
   * Convert a presentation definition JSON object to a PresentationDefinition instance.
   * @param {PresentationDefinitionJSON} json - The presentation definition JSON object.
   * @returns {PresentationDefinition} A new PresentationDefinition instance.
   */
  static fromJSON(json: unknown): PresentationDefinition {
    const parsedJson = presentationDefinitionSchema.parse(json);
    return new PresentationDefinition(
      new Id(parsedJson.id),
      parsedJson.name ? new Name(parsedJson.name) : undefined,
      parsedJson.purpose ? new Purpose(parsedJson.purpose) : undefined,
      parsedJson.format ? Format.fromJSON(parsedJson.format) : undefined,
      parsedJson.input_descriptors?.map((inputDescriptor) =>
        InputDescriptor.fromJSON(inputDescriptor)
      ),
      parsedJson.submission_requirements?.map((submissionRequirement) =>
        SubmissionRequirement.fromJSON(submissionRequirement)
      )
    );
  }
}
