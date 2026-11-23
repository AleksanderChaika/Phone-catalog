import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { CartProvider } from '../../context/CartContext';
import { FavoritesProvider } from '../../context/FavoritesContext';
import { createProduct, routerFuture } from '../../testUtils';
import { Product } from '../../types/Product';

const renderCard = (overrides: Partial<Product>) =>
  render(
    <MemoryRouter future={routerFuture}>
      <CartProvider>
        <FavoritesProvider>
          <ProductCard product={createProduct(1, overrides)} />
        </FavoritesProvider>
      </CartProvider>
    </MemoryRouter>,
  );

describe('ProductCard price', () => {
  it('shows both prices for an older model with a discount', () => {
    renderCard({ year: 2020, price: 500, fullPrice: 600 });

    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('$600')).toBeInTheDocument();
  });

  it('shows one price for a new model even if the data has a discount', () => {
    renderCard({ year: 2022, price: 500, fullPrice: 600 });

    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.queryByText('$600')).not.toBeInTheDocument();
  });

  it('shows one price for an older model with equal prices', () => {
    renderCard({ year: 2020, price: 700, fullPrice: 700 });

    expect(screen.getAllByText('$700')).toHaveLength(1);
  });

  it('describes the cart button with the product name', () => {
    renderCard({ name: 'Apple iPhone 11' });

    expect(
      screen.getByRole('button', { name: 'Add to cart' }),
    ).toHaveAccessibleDescription('Apple iPhone 11');
  });
});
