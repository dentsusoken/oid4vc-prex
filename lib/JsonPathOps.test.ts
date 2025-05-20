import { JsonPathOps, toJsonPath, toJsonString } from './JsonPathOps';
import { describe, it, expect } from 'vitest';

describe('JsonPathOps', () => {
  describe('isValid', () => {
    it('should return true for valid JSONPath', () => {
      const validJsonPath = '$.store.book[*].author';
      expect(JsonPathOps.isValid(validJsonPath)).toBe(true);
    });
  });

  describe('getJsonAtPath', () => {
    it('should return the correct value for a valid JSONPath', () => {
      const json = '{"store":{"book":[{"author":"John Smith"}]}}';
      const jsonPath = '$.store.book[*].author';
      expect(JsonPathOps.getJsonAtPath(jsonPath, json)).toEqual(
        '["John Smith"]',
      );
    });
  });
});

describe('toJsonPath', () => {
  it('should return the JSONPath object for a valid path', () => {
    const path = '$.store.book[*].author';
    expect(toJsonPath(path).isSuccess()).toBe(true);
  });
});

describe('toJsonString', () => {
  it('should return the JSON string representation of a JSON node', () => {
    const jsonNode = { name: 'John', age: 30 };
    const expected = '{"name":"John","age":30}';
    expect(toJsonString(jsonNode)).toEqual(expected);
  });

  it('should return an empty string for null input', () => {
    const jsonNode = null;
    const expected = '{}';
    expect(toJsonString(jsonNode)).toEqual(expected);
  });

  it('should return an empty string for undefined input', () => {
    const jsonNode = undefined;
    const expected = '{}';
    expect(toJsonString(jsonNode)).toEqual(expected);
  });
});
