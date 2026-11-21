import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LocationProbe, createProduct, routerFuture } from './testUtils';

// 20 phones: with 16 per page that is a full first page and 4 on the second
const phones = Array.from({ length: 20 }, (_, i) => createProduct(i + 1));

const mockFetch = () =>
  vi.fn(async (url: string) => ({
    ok: true,
    statusText: 'OK',
    json: async () => (url.includes('products.json') ? phones : []),
  }));

const renderApp = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]} future={routerFuture}>
      <CartProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CartProvider>
      <LocationProbe />
    </MemoryRouter>,
  );

describe('phones page and the ?page param', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.stubGlobal('fetch', mockFetch());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the products and shows the first page', async () => {
    renderApp('/phones');

    expect(await screen.findAllByRole('article')).toHaveLength(16);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/api\/products\.json$/),
    );
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('redirects ?page=99 to the last page with replace', async () => {
    renderApp('/phones?page=99');

    // Only 4 phones are left on the last page
    await vi.waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });

    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByTestId('location')).toHaveTextContent('/phones?page=2');
    expect(screen.getByTestId('navigation-type')).toHaveTextContent('REPLACE');
  });

  it.each(['abc', '-5', '0'])(
    'redirects ?page=%s to the first page',
    async param => {
      renderApp(`/phones?page=${param}`);

      await vi.waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(16);
      });

      expect(screen.getByTestId('location')).toHaveTextContent(
        '/phones?page=1',
      );
      expect(screen.getByTestId('navigation-type')).toHaveTextContent(
        'REPLACE',
      );
    },
  );

  it('leaves a valid page alone', async () => {
    renderApp('/phones?page=2');

    await vi.waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });

    expect(screen.getByTestId('location')).toHaveTextContent('/phones?page=2');
    expect(screen.getByTestId('navigation-type')).toHaveTextContent('POP');
    expect(
      within(screen.getByRole('main')).getByRole('heading', {
        name: 'Mobile phones',
      }),
    ).toBeInTheDocument();
  });
});
