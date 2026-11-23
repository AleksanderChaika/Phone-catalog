import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddToCartButton } from './AddToCartButton';
import { CartProvider, useCart } from '../../context/CartContext';
import { createProduct } from '../../testUtils';

const product = createProduct(1);

const CartCount: React.FC = () => {
  const { cart } = useCart();

  return <output data-testid="cart-count">{cart.length}</output>;
};

const renderButton = (className?: string, describedById?: string) =>
  render(
    <CartProvider>
      <h3 id="title">Phone 1</h3>
      <AddToCartButton
        product={product}
        className={className}
        describedById={describedById}
      />
      <CartCount />
    </CartProvider>,
  );

describe('AddToCartButton', () => {
  it('starts as "Add to cart" without the active state', () => {
    renderButton();

    const button = screen.getByRole('button', { name: 'Add to cart' });

    expect(button).not.toHaveClass('is-active');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('adds the product and shows the active state on click', async () => {
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(screen.getByRole('button', { name: 'Added' })).toHaveClass(
      'is-active',
    );
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  it('removes the product and goes back on the second click', async () => {
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    await userEvent.click(screen.getByRole('button', { name: 'Added' }));

    expect(screen.getByRole('button', { name: 'Add to cart' })).not.toHaveClass(
      'is-active',
    );
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('is a button that does not submit forms and takes a className', () => {
    renderButton('size-class');

    const button = screen.getByRole('button', { name: 'Add to cart' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('add-to-cart', 'size-class');
  });

  it('shows the active state when the product is already in the cart', () => {
    localStorage.setItem('cart', JSON.stringify([{ ...product, quantity: 2 }]));
    renderButton();

    expect(screen.getByRole('button', { name: 'Added' })).toHaveClass(
      'is-active',
    );
  });

  it('is described by the element it points to', () => {
    renderButton(undefined, 'title');

    expect(
      screen.getByRole('button', { name: 'Add to cart' }),
    ).toHaveAccessibleDescription('Phone 1');
  });

  it('has no description without describedById', () => {
    renderButton();

    expect(
      screen.getByRole('button', { name: 'Add to cart' }),
    ).toHaveAccessibleDescription('');
  });
});
