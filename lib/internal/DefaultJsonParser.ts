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
import { plainToInstance } from 'class-transformer';
import { JsonParser } from '../JsonParser';
import { Result, runCatching } from '../kotlin';
import { JsonObject, PresentationSubmission } from '../Types';

/**
 * The key under which a presentation definition is expected to be found
 * as defined in Presentation Exchange specification
 */
// const presentationDefinitionKey = 'presentation_definition';

const presentationSubmissionKey = 'presentation_submission';

export enum PresentationSubmissionEmbedLocation {
  JWT,
  OIDC,
  DIDComms,
  VP,
  CHAPI,
}

export namespace PresentationSubmissionEmbedLocation {
  export function extractFrom(
    location: PresentationSubmissionEmbedLocation,
    json: JsonObject
  ): JsonObject {
    let root: JsonObject;
    switch (location) {
      case PresentationSubmissionEmbedLocation.OIDC:
      case PresentationSubmissionEmbedLocation.VP:
        root = json;
        break;
      case PresentationSubmissionEmbedLocation.JWT:
        root = json['vp'] as JsonObject;
        break;
      case PresentationSubmissionEmbedLocation.DIDComms:
        root = (
          (json['presentations~attach'] as JsonObject)?.data as JsonObject
        )?.json as JsonObject;
        break;
      case PresentationSubmissionEmbedLocation.CHAPI:
        root = json['data'] as JsonObject;
        break;
    }
    return root?.[presentationSubmissionKey] as JsonObject;
  }
}

export const DefaultJsonParser: JsonParser = {
  async decodePresentationSubmission(
    input: string | ReadableStream<Uint8Array>
  ): Promise<any> {
    if (typeof input === 'string') {
      return mapToPS(JSON.parse(input));
    } else {
      const reader = input.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        result += decoder.decode(value);
      }
      return this.decodePresentationSubmission(result);
    }
  },
};

export const mapToPS = async (
  json: JsonObject
): Promise<Result<PresentationSubmission>> => {
  return runCatching(() => {
    const pdObject: JsonObject =
      Object.values(PresentationSubmissionEmbedLocation)
        .filter((v) => typeof v === 'number')
        .map((location) =>
          PresentationSubmissionEmbedLocation.extractFrom(
            location as PresentationSubmissionEmbedLocation,
            json
          )
        )
        .find((v) => typeof v !== 'undefined') || json;

    return plainToInstance(
      PresentationSubmission,
      pdObject as Record<string, unknown>
    );
  });
};
