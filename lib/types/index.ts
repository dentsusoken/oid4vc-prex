import { JSONSchema7 } from 'json-schema';

/**
 * JSON Schema type.
 *
 * @description Type alias for JSON Schema version 7.
 * @see https://identity.foundation/presentation-exchange/spec/v2.0.0/#json-schemas
 */
export type JSONSchema = JSONSchema7;

export * from './Constraints';
export * from './DescriptorMap';
export * from './FieldConstraint';
export * from './Filter';
export * from './Format';
export * from './From';
export * from './Group';
export * from './Id';
export * from './InputDescriptor';
export * from './InputDescriptorId';
export * from './JsonPath';
export * from './Name';
export * from './NonEmptySet';
export * from './PresentationDefinition';
export * from './PresentationSubmission';
export * from './Purpose';
export * from './Rule';
export * from './SubmissionRequirement';
export * from './JsonObject';
