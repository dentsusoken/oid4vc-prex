# OID4VC Presentation Exchange Library

A TypeScript library for handling OpenID for Verifiable Credentials (OID4VC) Presentation Exchange operations, providing comprehensive support for Presentation Definitions and Presentation Submissions according to the [Presentation Exchange specification](https://identity.foundation/presentation-exchange/).

## Features

- **Presentation Definition Support**: Full implementation of Presentation Definition types and validation
- **Presentation Submission Handling**: Parse and validate Presentation Submissions from various embed locations
- **JSON Path Operations**: Utilities for JSON Path validation and extraction
- **Type Safety**: Complete TypeScript support with comprehensive type definitions
- **Multiple Embed Locations**: Support for JWT, OIDC, DIDComms, VP, and CHAPI embed locations

## Installation

```bash
npm install @vecrea/oid4vc-prex
```

## Quick Start

```typescript
import { PresentationExchange, JsonPathOps } from '@vecrea/oid4vc-prex';

// Parse a Presentation Submission
const jsonString = '{"presentation_submission": {...}}';
const result =
  await PresentationExchange.jsonParse.decodePresentationSubmission(jsonString);

if (result.isSuccess()) {
  const submission = result.value;
  console.log('Submission ID:', submission.id);
} else {
  console.error('Failed to parse:', result.error);
}

// Validate JSON Path
const isValid = JsonPathOps.isValid('$.credential.credentialSubject.id');
console.log('Is valid JSON Path:', isValid);

// Extract data using JSON Path
const jsonData =
  '{"credential": {"credentialSubject": {"id": "did:example:123"}}}';
const extracted = JsonPathOps.getJsonAtPath(
  '$.credential.credentialSubject.id',
  jsonData
);
console.log('Extracted value:', extracted);
```

## API Reference

### PresentationExchange

The main entry point for the library.

#### `jsonParse.decodePresentationSubmission(input)`

Parses a Presentation Submission from a JSON string or ReadableStream.

**Parameters:**

- `input`: `string | ReadableStream<Uint8Array>` - The JSON input

**Returns:** `Promise<Result<PresentationSubmission>>`

**Example:**

```typescript
const result =
  await PresentationExchange.jsonParse.decodePresentationSubmission(jsonString);
```

### JsonPathOps

Utility class for JSON Path operations.

#### `JsonPathOps.isValid(path)`

Validates if a string is a valid JSON Path.

**Parameters:**

- `path`: `string` - The JSON Path to validate

**Returns:** `boolean`

#### `JsonPathOps.getJsonAtPath(jsonPath, jsonString)`

Extracts data from JSON using a JSON Path.

**Parameters:**

- `jsonPath`: `string` - The JSON Path expression
- `jsonString`: `string` - The JSON string to extract from

**Returns:** `string` - The extracted value as a JSON string

### Types

The library exports comprehensive TypeScript types for all Presentation Exchange components:

- `JSONSchema` - JSON Schema type alias for version 7
- `Constraints` - Constraint definitions for input descriptors
- `DescriptorMap` - Descriptor mapping specifications
- `FieldConstraint` - Field-level constraint definitions
- `Filter` - Filter specifications for credential filtering
- `Format` - Format definitions for credential formats
- `From` - Source specification for credentials
- `Group` - Group definitions for organizing input descriptors
- `Id` - Identifier types
- `InputDescriptor` - Input descriptor specifications
- `InputDescriptorId` - Input descriptor identifier types
- `JsonObject` - JSON object type definitions
- `JsonPath` - JSON Path type definitions
- `Name` - Name type definitions
- `NonEmptySet` - Non-empty set type definitions
- `PresentationDefinition` - Core presentation definition structure
- `PresentationSubmission` - Presentation submission data
- `Purpose` - Purpose definitions for input descriptors
- `Rule` - Rule definitions for constraints
- `SubmissionRequirement` - Submission requirement specifications

## Embed Locations

The library supports parsing Presentation Submissions from various embed locations:

- **JWT**: Embedded in JWT tokens
- **OIDC**: Embedded in OpenID Connect flows
- **DIDComms**: Embedded in DID Communication messages
- **VP**: Embedded in Verifiable Presentations
- **CHAPI**: Embedded in Credential Handler API responses

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## License

Licensed under the Apache License, Version 2.0. See the LICENSE file for details.

## Contributing

This project follows the [Presentation Exchange specification](https://identity.foundation/presentation-exchange/spec/v2.0.0/). When contributing, please ensure compliance with the specification and maintain type safety.

## Related Links

- [Presentation Exchange Specification](https://identity.foundation/presentation-exchange/)
- [OpenID for Verifiable Credentials](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
