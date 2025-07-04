import { describe, expect, it } from 'vitest';
import { jsonObjectSchema } from '../JsonObject';

describe('JsonObject', () => {
  it('should be a JSON object with string keys and unknown values', () => {
    const validJsonObject = { key: 'value' };
    const invalidJsonObject = 123;

    expect(jsonObjectSchema.safeParse(validJsonObject).success).toBe(true);
    expect(jsonObjectSchema.safeParse(invalidJsonObject).success).toBe(false);
  });
});
