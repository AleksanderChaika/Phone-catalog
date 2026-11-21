import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../../../context/CartContext';
import { CartPage } from './CartPage';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

const cartItem = (id: number, price: number, quantity: number) => ({
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
  quantity,
});

const renderCartPage = () =>
  render(
    <MemoryRouter future={routerFuture}>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </MemoryRouter>,
  );

describe('CartPage checkout', () => {
  beforeEach(() => {
    localStorage.setItem(
      'cart',
      JSON.stringify([cartItem(1, 500, 1), cartItem(2, 300, 2)]),
    );
  });

  it('shows the order message and keeps the items while open', async () => {
    const user = userEvent.setup();

    renderCartPage();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Checkout' }));

    const dialog = screen.getByRole('dialog', { name: 'Order placed' });

    expect(dialog).toHaveTextContent('Thank you for your order!');
    expect(screen.getByRole('img', { name: 'Phone 1' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Phone 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('clears the cart when closed with the button', async () => {
    const user = userEvent.setup();

    renderCartPage();

    await user.click(screen.getByRole('button', { name: 'Checkout' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Phone 1' })).toBeNull();
    expect(localStorage.getItem('cart')).toBe('[]');
    expect(screen.getByRole('heading', { name: 'Cart' })).toHaveFocus();
  });

  it('clears the cart when closed with Escape', async () => {
    const user = userEvent.setup();

    renderCartPage();

    await user.click(screen.getByRole('button', { name: 'Checkout' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(localStorage.getItem('cart')).toBe('[]');
  });
});
