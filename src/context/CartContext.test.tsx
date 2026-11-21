import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { Product } from '../types/Product';

const createProduct = (id: number, price: number): Product => ({
  id,
  category: 'phones',
  itemId: `phone-${id}`,
  name: `Phone ${id}`,
  fullPrice: price + 100,
  price,
  screen: '6"',
  capacity: '128GB',
  color: 'black',
  ram: '8GB',
  year: 2024,
  image: `img/phone-${id}.webp`,
});

const phoneA = createProduct(1, 500);
const phoneB = createProduct(2, 300);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const renderCart = () => renderHook(() => useCart(), { wrapper });

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    const { result } = renderCart();

    expect(result.current.cart).toEqual([]);
    expect(result.current.totalAmount).toBe(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.isCheckout).toBe(false);
  });

  it('adds a product with quantity 1', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(phoneA));

    expect(result.current.cart).toEqual([{ ...phoneA, quantity: 1 }]);
  });

  it('increases the quantity instead of duplicating a product', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(phoneA));
    act(() => result.current.addToCart(phoneA));

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('changes the quantity up and down', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(phoneA));
    act(() => result.current.changeQuantity(phoneA.id, 1));
    act(() => result.current.changeQuantity(phoneA.id, 1));

    expect(result.current.cart[0].quantity).toBe(3);

    act(() => result.current.changeQuantity(phoneA.id, -1));

    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('never lets the quantity go below 1', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(phoneA));
    act(() => result.current.changeQuantity(phoneA.id, -1));
    act(() => result.current.changeQuantity(phoneA.id, -5));

    expect(result.current.cart[0].quantity).toBe(1);
  });

  it('removes a product and keeps the others', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(phoneA));
    act(() => result.current.addToCart(phoneB));
    act(() => result.current.removeFromCart(phoneA.id));

    expect(result.current.cart.map(item => item.id)).toEqual([phoneB.id]);
  });

  it('calculates the total amount and the number of items', () => {
    const { result } = renderCart();

    act(() => result.current.addToCart(phoneA));
    act(() => result.current.addToCart(phoneB));
    act(() => result.current.changeQuantity(phoneB.id, 2));

    expect(result.current.totalItems).toBe(4);
    expect(result.current.totalAmount).toBe(500 + 300 * 3);
  });

  it('persists the cart in localStorage and restores it', () => {
    const first = renderCart();

    act(() => first.result.current.addToCart(phoneA));

    expect(JSON.parse(localStorage.getItem('cart') ?? '[]')).toEqual([
      { ...phoneA, quantity: 1 },
    ]);

    first.unmount();

    const second = renderCart();

    expect(second.result.current.cart).toEqual([{ ...phoneA, quantity: 1 }]);
  });

  describe('checkout', () => {
    it('does nothing when the cart is empty', () => {
      const { result } = renderCart();

      act(() => result.current.handleCheckout());

      expect(result.current.isCheckout).toBe(false);
    });

    it('opens the confirmation and keeps the cart until it is closed', () => {
      const { result } = renderCart();

      act(() => result.current.addToCart(phoneA));
      act(() => result.current.handleCheckout());

      // Regression: the cart used to be cleared right here, so the modal,
      // which is shown only for a non-empty cart, could never appear
      expect(result.current.isCheckout).toBe(true);
      expect(result.current.cart).toHaveLength(1);
    });

    it('clears the cart and closes the confirmation on close', () => {
      const { result } = renderCart();

      act(() => result.current.addToCart(phoneA));
      act(() => result.current.handleCheckout());
      act(() => result.current.closeCheckout());

      expect(result.current.isCheckout).toBe(false);
      expect(result.current.cart).toEqual([]);
      expect(localStorage.getItem('cart')).toBe('[]');
    });
  });

  it('throws when used outside of CartProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider',
    );

    consoleError.mockRestore();
  });
});
