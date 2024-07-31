import { describe, expect, it } from 'vitest';
import { PresentationExchange } from './PresentationExchange';
import { Result } from './kotlin';
import { PresentationSubmission } from './Types';

describe('PresentationExchange', () => {
  describe('jsonParse', () => {
    describe('decodePresentationSubmission', () => {
      it('should return a PresentationSubmission when json string', async () => {
        const jsonStr = `{
            "id": "aaaa",
            "definition_id": "bbbb",
            "descriptor_map": [
              {
                "id": "cccc",
                "format": "jwt",
                "path": "$.verifiableCredential[0]"
              }
            ]
          }`;
        const result =
          await PresentationExchange.jsonParse.decodePresentationSubmission(
            jsonStr
          );

        expect(result).toBeInstanceOf(Result);
        expect(result.getOrThrow()).toBeInstanceOf(PresentationSubmission);
      });
      it('should return a PresentationSubmission when ReadableStream', async () => {
        const jsonStr = `{
            "id": "aaaa",
            "definition_id": "bbbb",
            "descriptor_map": [
              {
                "id": "cccc",
                "format": "jwt",
                "path": "$.verifiableCredential[0]"
              }
            ]
          }`;

        const stream = new Request('https://example.com', {
          method: 'POST',
          body: jsonStr,
        }).body!;
        const result =
          await PresentationExchange.jsonParse.decodePresentationSubmission(
            stream
          );

        expect(result).toBeInstanceOf(Result);
        expect(result.getOrThrow()).toBeInstanceOf(PresentationSubmission);
      });
    });
  });
});
