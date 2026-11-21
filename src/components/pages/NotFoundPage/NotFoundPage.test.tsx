import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

describe('NotFoundPage', () => {
  it('links to the home page by default', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to Home Page' }),
    ).toHaveAttribute('href', '/');
  });

  it('renders custom texts and link', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <NotFoundPage
          subtitle="Product not found"
          linkTo="/tablets"
          linkLabel="Back to tablets"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Product not found')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Back to tablets' }),
    ).toHaveAttribute('href', '/tablets');
  });
});
