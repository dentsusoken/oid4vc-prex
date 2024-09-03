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
import { Format, formatSchema } from './Format';
import { InputDescriptor, inputDescriptorSchema } from './InputDescriptor';
import {
  SubmissionRequirement,
  submissionRequirementSchema,
} from './SubmissionRequirement';

export const presentationDefinitionSchema = z.object({
  id: idSchema,
  name: nameSchema.optional(),
  purpose: purposeSchema.optional(),
  format: formatSchema.optional(),
  input_descriptors: z.array(inputDescriptorSchema).optional(),
  submission_requirements: z.array(submissionRequirementSchema).optional(),
});

export type PresentationDefinitionJSON = z.infer<
  typeof presentationDefinitionSchema
>;

export class PresentationDefinition {
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

  static fromJSON(json: PresentationDefinitionJSON): PresentationDefinition {
    return new PresentationDefinition(
      new Id(json.id),
      json.name ? new Name(json.name) : undefined,
      json.purpose ? new Purpose(json.purpose) : undefined,
      json.format ? new Format(json.format) : undefined,
      json.input_descriptors?.map((inputDescriptor) =>
        InputDescriptor.fromJSON(inputDescriptor)
      ),
      json.submission_requirements?.map((submissionRequirement) =>
        SubmissionRequirement.fromJSON(submissionRequirement)
      )
    );
  }
}
