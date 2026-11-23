import { describe, expect, it } from 'vitest';
import { NEW_MODELS_FROM_YEAR, hasDiscount } from './discount';

describe('hasDiscount', () => {
  it('is false for a new model with a lower price', () => {
    expect(
      hasDiscount({ year: NEW_MODELS_FROM_YEAR, price: 500, fullPrice: 600 }),
    ).toBe(false);
  });

  it('is true for an older model with a lower price', () => {
    expect(
      hasDiscount({
        year: NEW_MODELS_FROM_YEAR - 1,
        price: 500,
        fullPrice: 600,
      }),
    ).toBe(true);
  });

  it('is false for an older model with equal prices', () => {
    expect(
      hasDiscount({
        year: NEW_MODELS_FROM_YEAR - 1,
        price: 600,
        fullPrice: 600,
      }),
    ).toBe(false);
  });
});
