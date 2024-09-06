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

/**
 * Zod schema for validating claim format designations.
 *
 * This schema ensures that a value matches one of the registered claim format designations.
 * It applies the following validations:
 * - The value must be a string.
 * - The string must match one of the following: 'jwt', 'jwt_vc', 'jwt_vp', 'ldp', 'ldp_vc', 'ldp_vp', 'ac_vc', 'ac_vp', 'mso_mdoc'.
 *
 * @type {z.ZodNativeEnum<ClaimFormat>}
 *
 * @example
 * // Valid usage
 * claimFormatSchema.parse('jwt'); // Returns 'jwt'
 * claimFormatSchema.parse('ldp_vc'); // Returns 'ldp_vc'
 *
 * // Invalid usage (will throw ZodError)
 * claimFormatSchema.parse('invalid_format'); // Throws error: Input not valid
 * claimFormatSchema.parse(123); // Throws error: Expected string, received number
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 * @see {@link https://identity.foundation/presentation-exchange/spec/v2.0.0/#claim-format-designations} for more details on claim format designations.
 */
export const claimFormatSchema = z.enum([
  'jwt',
  'jwt_vc',
  'jwt_vp',
  'ldp',
  'ldp_vc',
  'ldp_vp',
  'ac_vc',
  'ac_vp',
  'mso_mdoc',
]);

/**
 * Zod schema for validating FormatJSONClaims values.
 *
 * This schema ensures that a value is an object with optional 'alg' and 'proof_type' properties.
 * - 'alg' must be a set of non-empty strings or undefined.
 * - 'proof_type' must be a set of non-empty strings or undefined.
 *
 * @type {z.ZodObject<{ alg: z.ZodArray<z.ZodString>; proof_type: z.ZodArray<z.ZodString> }>}
 *
 * @example
 * // Valid usage
 * formatJSONClaimsSchema.parse({ alg: ['HS256'], proof_type: ['JsonWebSignature2020'] }); // Returns { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] }
 * formatJSONClaimsSchema.parse({ alg: ['HS256'] }); // Returns { alg: ['HS256'] }
 * formatJSONClaimsSchema.parse({}); // Returns {}
 *
 * // Invalid usage (will throw ZodError)
 * formatJSONClaimsSchema.parse({ alg: [''] }); // Throws error: String must contain at least 1 character(s)
 * formatJSONClaimsSchema.parse({ alg: [123] }); // Throws error: Expected string, received number
 * formatJSONClaimsSchema.parse('HS256'); // Throws error: Expected object, received string
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const formatJSONClaimsSchema = z.object({
  alg: createNonEmptySetSchema(z.string().min(1)).optional(),
  proof_type: createNonEmptySetSchema(z.string().min(1)).optional(),
});

/**
 * Zod schema for validating DefinitionFormatJSON values.
 *
 * This schema ensures that a value is a record where keys are claim format designations and values are DefinitionFormatJSONClaims.
 * - Keys must match one of the registered claim format designations.
 * - Values must be an object with optional 'alg' and 'proof_type' properties.
 *
 * @type {z.ZodRecord<z.ZodObject<{ alg: z.ZodArray<z.ZodString>; proof_type: z.ZodArray<z.ZodString> }>>}
 *
 * @example
 * // Valid usage
 * formatSchema.parse({ jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] } }); // Returns { jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] } }
 * formatSchema.parse({ jwt: { alg: ['HS256'] } }); // Returns { jwt: { alg: ['HS256'] } }
 * formatSchema.parse({}); // Returns {}
 *
 * // Invalid usage (will throw ZodError)
 * formatSchema.parse({ jwt: { alg: [''] } }); // Throws error: String must contain at least 1 character(s)
 * formatSchema.parse({ jwt: { alg: [123] } }); // Throws error: Expected string, received number
 * formatSchema.parse('jwt'); // Throws error: Expected object, received string
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const formatSchema = z.record(claimFormatSchema, formatJSONClaimsSchema);

/**
 * Type of the claim format designation.
 *
 * @see https://identity.foundation/presentation-exchange/spec/v2.0.0/#claim-format-designations
 *
 */
export type ClaimFormat = z.infer<typeof claimFormatSchema>;

/**
 * Type of the FormatJSONClaims.
 *
 * @see https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-definition
 *
 * @example
 * {
 *  "alg": ["EdDSA", "ES256K", "ES384"],
 *  "proof_type": [
          "JsonWebSignature2020",
          "Ed25519Signature2018",
          "EcdsaSecp256k1Signature2019",
          "RsaSignature2018"
    ]
 * }
 */
export type FormatJSONClaims = z.infer<typeof formatJSONClaimsSchema>;

/**
 * Type of the FormatJSON.
 *
 * @see https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-definition
 *
 * @example
 * {
 *  "jwt": {
 *    "alg": ["EdDSA", "ES256K", "ES384"],
 *    "proof_type": [
          "JsonWebSignature2020",
          "Ed25519Signature2018",
          "EcdsaSecp256k1Signature2019",
          "RsaSignature2018"
    ]
 *  }
 * }
 */
export type FormatJSON = z.infer<typeof formatSchema>;

/**
 * Represents a format property of Presentation Definition and Input Descriptor.
 *
 * @class
 * @example
 * // Create a valid Id instance
 * const format = new Format({
 *  jwt: {
 *   alg: ['EdDSA', 'ES256K', 'ES384'],
 *  }
 * });
 * console.log(format.value); // Outputs: '{"jwt":{"alg":["EdDSA","ES256K","ES384"]}}'
 *
 */
export class Format {
  /**
   * Creates a new Format instance.
   * @param {FormatJSON} json - JSON Object representation of the Format.
   */
  private constructor(public json: FormatJSON) {}

  /**
   * Creates a Format instance from a JSON .
   * @param {FormatJSON} json - JSON Object representation of the Format.
   * @returns {Format} Format instance.
   */
  static fromJSON(json: FormatJSON): Format {
    return new Format(json);
  }

  /**
   * Creates a Format instance from a JSON .
   * @param {FormatJSON} json - JSON Object representation of the Format.
   * @returns {Format} Format instance.
   * @deprecated Use `fromJSON` method instead.
   */
  static format(json: FormatJSON): Format {
    return new Format(json);
  }

  /**
   * Returns the JSON representation of the Format.
   * @returns {FormatJSON} JSON string representation of the Format.
   */
  toJSON(): FormatJSON {
    return this.json;
  }

  /**
   * Returns the JSON representation of the Format.
   * @returns {FormatJSON} JSON string representation of the Format.
   * @deprecated Use `toJSON` method instead.
   */
  jsonObject(): FormatJSON {
    return this.json;
  }
}
