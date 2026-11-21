import { describe, expect, it } from 'vitest';
import { getValidPage } from './pagination';

describe('getValidPage', () => {
  it.each([
    ['2', 5, 2],
    ['1', 5, 1],
    ['5', 5, 5],
  ])('keeps the valid page %s of %i', (param, totalPages, expected) => {
    expect(getValidPage(param, totalPages)).toBe(expected);
  });

  it('defaults to the first page when the param is missing', () => {
    expect(getValidPage(null, 5)).toBe(1);
  });

  it('moves a page above the last one to the last page', () => {
    expect(getValidPage('99', 8)).toBe(8);
  });

  it.each(['0', '-5', 'abc', '', 'NaN'])(
    'falls back to the first page for %j',
    param => {
      expect(getValidPage(param, 8)).toBe(1);
    },
  );

  it('rounds fractional pages down', () => {
    expect(getValidPage('2.7', 8)).toBe(2);
  });

  it('never returns a page below 1 even without pages', () => {
    expect(getValidPage('3', 0)).toBe(1);
  });
});
