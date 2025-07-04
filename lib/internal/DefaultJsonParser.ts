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
import { JsonParser } from '../JsonParser';
import { Result, runCatching } from '@vecrea/oid4vc-core/utils';
import {
  JsonObject,
  PresentationSubmission,
  PresentationSubmissionJSON,
  jsonObjectSchema,
  presentationSubmissionSchema,
} from '../types';

/**
 * The key under which a presentation definition is expected to be found
 * as defined in Presentation Exchange specification
 */
export const presentationDefinitionKey = 'presentation_definition';

/**
 * The key under which a presentation submission is expected to be found
 * as defined in Presentation Exchange specification
 */
export const presentationSubmissionKey = 'presentation_submission';

/**
 * The location where the presentation submission is embedded
 * @enum
 * @see https://identity.foundation/presentation-exchange/spec/v2.0.0/#embed-locations
 */
export enum PresentationSubmissionEmbedLocation {
  JWT,
  OIDC,
  DIDComms,
  VP,
  CHAPI,
}

/**
 * Namespace for presentation submission embed location
 * @namespace
 */
export namespace PresentationSubmissionEmbedLocation {
  /**
   * Detects the root of the presentation submission
   * @param {PresentationSubmissionEmbedLocation} location the location where the presentation submission is embedded
   * @param {JsonObject} json the JSON object
   * @return {JsonObject} the root of the presentation submission
   */
  const detectRoot = (
    location: PresentationSubmissionEmbedLocation,
    json: JsonObject
  ): JsonObject => {
    switch (location) {
      case PresentationSubmissionEmbedLocation.OIDC:
      case PresentationSubmissionEmbedLocation.VP:
        return json;
      case PresentationSubmissionEmbedLocation.JWT:
        return jsonObjectSchema.parse(json['vp']);
      case PresentationSubmissionEmbedLocation.DIDComms:
        return jsonObjectSchema.parse(
          jsonObjectSchema.parse(
            jsonObjectSchema.parse(json['presentations~attach']).data
          ).json
        );
      case PresentationSubmissionEmbedLocation.CHAPI:
        return jsonObjectSchema.parse(json.data);
      default:
        throw new Error('Unsupported location');
    }
  };

  /**
   * Extracts the presentation submission from a JSON object
   * @param {PresentationSubmissionEmbedLocation} location the location where the presentation submission is embedded
   * @param {JsonObject} json the JSON object
   * @return {PresentationSubmissionJSON | undefined} the presentation submission or undefined if not found
   */
  export function extractFrom(
    location: PresentationSubmissionEmbedLocation,
    json: JsonObject
  ): PresentationSubmissionJSON | undefined {
    try {
      const root = detectRoot(location, json);
      return presentationSubmissionSchema.parse(
        root[presentationSubmissionKey]
      );
    } catch (_) {
      return;
    }
  }
}
/**
 * Default JSON parser implementation
 */
export const DefaultJsonParser: JsonParser = {
  /**
   * Decodes a presentation submission from a JSON string or a stream
   * @param {string | ReadableStream<Uint8Array>} input the JSON string or stream
   * @return {Promise<Result<PresentationSubmission>>} the presentation submission
   */
  async decodePresentationSubmission(
    input: string | ReadableStream<Uint8Array>
  ): Promise<Result<PresentationSubmission>> {
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

/**
 * Maps a JSON object to a presentation submission
 * @param {JsonObject} json the JSON object
 * @return {Promise<Result<PresentationSubmission>>} the presentation submission
 */
export const mapToPS = async (
  json: JsonObject
): Promise<Result<PresentationSubmission>> => {
  return runCatching(() => {
    const pdObject =
      Object.values(PresentationSubmissionEmbedLocation)
        .filter((v) => typeof v === 'number')
        .map((location) =>
          PresentationSubmissionEmbedLocation.extractFrom(
            location as PresentationSubmissionEmbedLocation,
            json
          )
        )
        .find((v) => typeof v !== 'undefined') ||
      presentationSubmissionSchema.parse(json);
    return PresentationSubmission.fromJSON(pdObject);
  });
};
