import { describe, expect, it } from 'vitest';
import {
  DefaultJsonParser,
  PresentationSubmissionEmbedLocation,
  mapToPS,
} from './DefaultJsonParser';
import basicPS from '../../mock-data/presentation-submission/basic-example.json';

describe('DefaultJsonParser', () => {
  describe('PresentationSubmissionEmbedLocation', () => {
    describe('extractFrom', () => {
      describe('should return presentation_submission', () => {
        it('when location is OIDC', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.OIDC,
            {
              presentation_submission: basicPS,
            }
          );
          expect(result).toStrictEqual(basicPS);
        });
        it('when location is VP', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.VP,
            {
              presentation_submission: basicPS,
            }
          );
          expect(result).toStrictEqual(basicPS);
        });
        it('when location is JWT', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.JWT,
            {
              vp: {
                presentation_submission: basicPS,
              },
            }
          );
          expect(result).toStrictEqual(basicPS);
        });
        it('when location is DIDComms', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.DIDComms,
            {
              'presentations~attach': {
                data: { json: { presentation_submission: basicPS } },
              },
            }
          );
          expect(result).toStrictEqual(basicPS);
        });
        it('when location is CHAPI', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.CHAPI,
            {
              data: { presentation_submission: basicPS },
            }
          );
          expect(result).toStrictEqual(basicPS);
        });
      });
      describe('should return undefined', () => {
        it('when location is OIDC', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.OIDC,
            {
              id: 'OIDC',
            }
          );
          expect(result).toBeUndefined;
        });
        it('when location is VP', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.VP,
            {
              id: 'VP',
            }
          );
          expect(result).toBeUndefined;
        });
        it('when location is JWT', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.JWT,
            {
              id: 'JWT',
            }
          );
          expect(result).toBeUndefined;
        });
        it('when location is DIDComms', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.DIDComms,
            {
              id: 'DIDComms',
            }
          );
          expect(result).toBeUndefined;
        });
        it('when location is CHAPI', () => {
          const result = PresentationSubmissionEmbedLocation.extractFrom(
            PresentationSubmissionEmbedLocation.CHAPI,
            {
              id: 'CHAPI',
            }
          );
          expect(result).toBeUndefined;
        });
      });
    });
  });

  describe('DefaultJsonParser', () => {
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
        const result = await DefaultJsonParser.decodePresentationSubmission(
          jsonStr
        );

        expect(result.isSuccess).toBe(true);

        const ps = result.getOrThrow();
        expect(ps.id.value).toBe('aaaa');
        expect(ps.definitionId.value).toBe('bbbb');
        expect(ps.descriptorMaps).toHaveLength(1);
        expect(ps.descriptorMaps[0].id.value).toBe('cccc');
        expect(ps.descriptorMaps[0].format).toBe('jwt');
        expect(ps.descriptorMaps[0].path.value).toBe(
          '$.verifiableCredential[0]'
        );
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
        const result = await DefaultJsonParser.decodePresentationSubmission(
          stream
        );

        expect(result.isSuccess).toBe(true);

        const ps = result.getOrThrow();
        expect(ps.id.value).toBe('aaaa');
        expect(ps.definitionId.value).toBe('bbbb');
        expect(ps.descriptorMaps).toHaveLength(1);
        expect(ps.descriptorMaps[0].id.value).toBe('cccc');
        expect(ps.descriptorMaps[0].format).toBe('jwt');
        expect(ps.descriptorMaps[0].path.value).toBe(
          '$.verifiableCredential[0]'
        );
      });
    });
  });

  describe('mapToPS', () => {
    it('should return a Result<PresentationSubmission>', async () => {
      const json = {
        id: 'aaaa',
        definition_id: 'bbbb',
        descriptor_map: [
          {
            id: 'cccc',
            format: 'jwt',
            path: '$.verifiableCredential[0]',
          },
        ],
      };
      const result = await mapToPS(json);
      expect(result.isSuccess).toBe(true);
    });

    it('should Result<PresentationSubmission>.isSuccess === true and get PresentationSubmission', async () => {
      const json = {
        id: 'aaaa',
        definition_id: 'bbbb',
        descriptor_map: [
          {
            id: 'cccc',
            format: 'jwt',
            path: '$.verifiableCredential[0]',
          },
        ],
      };
      const result = await mapToPS(json);
      expect(result.isSuccess).toBe(true);
    });

    // it('should Result<PresentationSubmission>.isFailure === true and get PresentationSubmission', async () => {
    //   const json = {
    //     id: 'aaaa',
    //     definition_id: 'bbbb',
    //   };

    //   const result = await mapToPS(json);
    //   expect(result.isFailure).toBe(true);
    //   expect(() => result.getOrThrow()).toThrowError();
    // });
  });
});
