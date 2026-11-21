import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  it('returns the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', ['a']));

    expect(result.current[0]).toEqual(['a']);
  });

  it('reads an existing value from localStorage', () => {
    localStorage.setItem('key', JSON.stringify({ count: 5 }));

    const { result } = renderHook(() => useLocalStorage('key', { count: 0 }));

    expect(result.current[0]).toEqual({ count: 5 });
  });

  it('writes the new value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 1));

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem('key')).toBe('2');
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() => useLocalStorage('key', 1));

    act(() => result.current[1](current => current + 10));

    expect(result.current[0]).toBe(11);
    expect(localStorage.getItem('key')).toBe('11');
  });

  it('falls back to the initial value when the stored JSON is broken', () => {
    localStorage.setItem('key', '{not valid json');

    const { result } = renderHook(() => useLocalStorage('key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('keeps the state in sync with storage after a broken value', () => {
    localStorage.setItem('key', '{not valid json');

    const { result } = renderHook(() => useLocalStorage('key', 'fallback'));

    act(() => result.current[1]('fixed'));

    expect(localStorage.getItem('key')).toBe('"fixed"');
  });

  it('stores values of different keys separately', () => {
    const first = renderHook(() => useLocalStorage('first', 1));
    const second = renderHook(() => useLocalStorage('second', 2));

    act(() => first.result.current[1](10));

    expect(second.result.current[0]).toBe(2);
    expect(localStorage.getItem('first')).toBe('10');
    expect(localStorage.getItem('second')).toBe('2');
  });
});
