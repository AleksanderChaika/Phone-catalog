import React from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { Product } from './types/Product';

export const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

export const createProduct = (
  id: number,
  overrides: Partial<Product> = {},
): Product => ({
  id,
  category: 'phones',
  itemId: `phone-${id}`,
  name: `Phone ${id}`,
  fullPrice: 600,
  price: 500,
  screen: '6"',
  capacity: '128GB',
  color: 'black',
  ram: '8GB',
  year: 2024,
  image: `img/phone-${id}.webp`,
  ...overrides,
});

// Shows where the router is, so tests can check the URL and how we got there
export const LocationProbe: React.FC = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  return (
    <output data-testid="location">
      {`${location.pathname}${location.search}`}
      <span data-testid="navigation-type">{navigationType}</span>
    </output>
  );
};
