import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { CartProvider } from '../../../context/CartContext';
import { FavoritesProvider } from '../../../context/FavoritesContext';
import { createProduct, routerFuture } from '../../../testUtils';

const products = [
  createProduct(1, {
    name: 'New discounted',
    year: 2023,
    price: 500,
    fullPrice: 600,
  }),
  createProduct(2, {
    name: 'Old discounted',
    year: 2020,
    price: 300,
    fullPrice: 400,
  }),
  createProduct(3, {
    name: 'New regular',
    year: 2023,
    price: 700,
    fullPrice: 700,
  }),
];

const renderHome = () =>
  render(
    <MemoryRouter future={routerFuture}>
      <CartProvider>
        <FavoritesProvider>
          <HomePage products={products} />
        </FavoritesProvider>
      </CartProvider>
    </MemoryRouter>,
  );

const section = (title: string) => {
  const root = screen.getByRole('heading', { name: title }).closest('section');

  if (!root) {
    throw new Error(`No section for ${title}`);
  }

  return within(root);
};

describe('HomePage sections', () => {
  it('shows a single price for every card in "Brand new models"', () => {
    renderHome();

    const brandNew = section('Brand new models');

    expect(brandNew.getByText('$500')).toBeInTheDocument();
    expect(brandNew.getByText('$700')).toBeInTheDocument();
    expect(brandNew.queryByText('$600')).not.toBeInTheDocument();
  });

  it('lists new models without a discount in "Brand new models"', () => {
    renderHome();

    const brandNew = section('Brand new models');

    expect(brandNew.getByText('New regular')).toBeInTheDocument();
    expect(brandNew.queryByText('Old discounted')).not.toBeInTheDocument();
  });

  it('shows only older discounted models in "Hot prices"', () => {
    renderHome();

    const hot = section('Hot prices');

    expect(hot.getByText('Old discounted')).toBeInTheDocument();
    expect(hot.getByText('$300')).toBeInTheDocument();
    expect(hot.getByText('$400')).toBeInTheDocument();
    expect(hot.queryByText('New discounted')).not.toBeInTheDocument();
    expect(hot.queryByText('New regular')).not.toBeInTheDocument();
  });
});
