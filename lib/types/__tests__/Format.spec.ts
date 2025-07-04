import { describe, expect, it } from 'vitest';
import {
  claimFormatSchema,
  formatJSONClaimsSchema,
  formatSchema,
  Format,
} from '../Format';

describe('Format', () => {
  describe('claimFormatSchema', () => {
    it('should return claim format schema', () => {
      expect(claimFormatSchema.parse('jwt')).toEqual('jwt');
    });
    it('should throw ZodError', () => {
      expect(() => claimFormatSchema.parse('')).toThrowError();
      expect(() => claimFormatSchema.parse(123)).toThrowError();
    });
    describe('formatJSONClaimsSchema', () => {
      it('should return format JSON claims schema', () => {
        expect(
          formatJSONClaimsSchema.parse({
            alg: ['HS256'],
            proof_type: ['JsonWebSignature2020'],
          })
        ).toEqual({ alg: ['HS256'], proof_type: ['JsonWebSignature2020'] });
        expect(formatJSONClaimsSchema.parse({ alg: ['HS256'] })).toEqual({
          alg: ['HS256'],
        });
        expect(formatJSONClaimsSchema.parse({})).toEqual({});
      });
    });
    describe('formatSchema', () => {
      it('should return format JSON schema', () => {
        expect(
          formatSchema.parse({
            jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] },
          })
        ).toEqual({
          jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] },
        });
        expect(formatSchema.parse({ jwt: { alg: ['HS256'] } })).toEqual({
          jwt: { alg: ['HS256'] },
        });
        expect(formatSchema.parse({})).toEqual({});
      });
      it('should throw ZodError', () => {
        expect(() => formatSchema.parse({ jwt: { alg: [''] } })).toThrowError();
        expect(() =>
          formatSchema.parse({ jwt: { alg: [123] } })
        ).toThrowError();
        expect(() => formatSchema.parse('jwt')).toThrowError();
      });
    });
    describe('Format', () => {
      describe('fromJSON', () => {
        it('should return format instance', () => {
          const format = Format.fromJSON({
            jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] },
          });
          expect(format.json).toEqual({
            jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] },
          });
        });
      });
      describe('toJSON', () => {
        it('should return JSON string representation of the Format', () => {
          const format = Format.fromJSON({
            jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] },
          });
          expect(format.toJSON()).toEqual({
            jwt: { alg: ['HS256'], proof_type: ['JsonWebSignature2020'] },
          });
          expect(JSON.stringify(format)).toEqual(
            '{"jwt":{"alg":["HS256"],"proof_type":["JsonWebSignature2020"]}}'
          );
        });
      });
    });
  });
});
