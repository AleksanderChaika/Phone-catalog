import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { LocationProbe, createProduct, routerFuture } from './testUtils';
import { ProductDetails } from './types/ProductDetails';

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

  it('redirects ?page=99 to the last page (4 phones) via replace', async () => {
    renderApp('/phones?page=99');

    await vi.waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/phones?page=2',
      );
    });

    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByTestId('navigation-type')).toHaveTextContent('REPLACE');
  });

  it.each(['abc', '-5', '0'])(
    'redirects ?page=%s to the first page',
    async param => {
      renderApp(`/phones?page=${param}`);

      await vi.waitFor(() => {
        expect(screen.getAllByRole('article')).toHaveLength(16);
        expect(screen.getByTestId('location')).toHaveTextContent(
          '/phones?page=1',
        );
      });

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

    await act(async () => undefined);

    expect(screen.getByTestId('location')).toHaveTextContent('/phones?page=2');
    expect(screen.getByTestId('navigation-type')).toHaveTextContent('POP');
    expect(
      within(screen.getByRole('main')).getByRole('heading', {
        name: 'Mobile phones',
      }),
    ).toBeInTheDocument();
  });
});

describe('product page breadcrumbs', () => {
  const productName = 'Apple iPhone 11 Pro Max 64GB Midnightgreen';
  const detail: ProductDetails = {
    id: 'phone-1',
    category: 'phones',
    namespaceId: 'apple-iphone-11-pro-max',
    name: productName,
    capacityAvailable: ['64GB'],
    capacity: '64GB',
    priceRegular: 600,
    priceDiscount: 500,
    colorsAvailable: ['black'],
    color: 'black',
    images: ['img/phone-1.webp'],
    description: [],
    screen: '6"',
    resolution: '1080',
    processor: 'A13',
    ram: '4GB',
    camera: '12MP',
    zoom: '2x',
    cell: ['GPRS'],
  };

  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        statusText: 'OK',
        json: async () => {
          if (url.includes('products.json')) {
            return phones;
          }

          return url.includes('phones.json') ? [detail] : [];
        },
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the shared breadcrumbs ending with the product name', async () => {
    renderApp('/phones/phone-1');

    const nav = await screen.findByRole('navigation', { name: 'Breadcrumb' });
    const current = within(nav).getByText(productName);

    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveAttribute('title', productName);
    expect(within(nav).getByRole('link', { name: 'Phones' })).toHaveAttribute(
      'href',
      '/phones',
    );
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(nav.querySelectorAll('.breadcrumbs__separator')).toHaveLength(2);
  });
});

describe('product page', () => {
  const makeDetail = (id: string): ProductDetails => ({
    id,
    category: 'phones',
    namespaceId: 'apple-iphone',
    name: `Details ${id}`,
    capacityAvailable: ['128GB'],
    capacity: '128GB',
    priceRegular: 111,
    priceDiscount: 99,
    colorsAvailable: ['black'],
    color: 'black',
    images: ['img/phone.webp'],
    description: [],
    screen: '6"',
    resolution: '1080',
    processor: 'A13',
    ram: '4GB',
    camera: '12MP',
    zoom: '2x',
    cell: ['GPRS'],
  });

  const catalog = [
    createProduct(1, {
      itemId: 'new-phone',
      year: 2022,
      price: 500,
      fullPrice: 600,
    }),
    createProduct(2, {
      itemId: 'old-phone',
      year: 2020,
      price: 300,
      fullPrice: 400,
    }),
  ];

  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        statusText: 'OK',
        json: async () => {
          if (url.includes('products.json')) {
            return catalog;
          }

          return url.includes('phones.json')
            ? [makeDetail('new-phone'), makeDetail('old-phone')]
            : [];
        },
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const priceBlock = async (url: string) => {
    const { container } = renderApp(url);

    await screen.findByRole('navigation', { name: 'Breadcrumb' });

    const block = container.querySelector<HTMLElement>('.details__price-block');

    if (!block) {
      throw new Error('No price block');
    }

    return within(block);
  };

  it('shows one price for a new model, the same as on its card', async () => {
    const block = await priceBlock('/phones/new-phone');

    expect(block.getByText('$500')).toBeInTheDocument();
    expect(block.queryByText('$600')).not.toBeInTheDocument();
    expect(block.queryByText('$99')).not.toBeInTheDocument();
  });

  it('shows both prices for an older model with a discount', async () => {
    const block = await priceBlock('/phones/old-phone');

    expect(block.getByText('$300')).toBeInTheDocument();
    expect(block.getByText('$400')).toBeInTheDocument();
  });

  it('shows the cart state of the page on the same card', async () => {
    const { container } = renderApp('/phones/new-phone');

    const nav = await screen.findByRole('navigation', { name: 'Breadcrumb' });

    const pageButton =
      container.querySelector<HTMLElement>('.details__cart-btn');

    if (!pageButton) {
      throw new Error('No cart button');
    }

    await userEvent.click(pageButton);

    expect(pageButton).toHaveTextContent('Added');

    await userEvent.click(within(nav).getByRole('link', { name: 'Phones' }));

    const card = (
      await screen.findByRole('heading', { name: 'Phone 1' })
    ).closest('article');

    if (!card) {
      throw new Error('No card');
    }

    expect(within(card).getByRole('button', { name: 'Added' })).toHaveClass(
      'is-active',
    );
  });

  it('describes the page cart button with the product title', async () => {
    const { container } = renderApp('/phones/new-phone');

    await screen.findByRole('navigation', { name: 'Breadcrumb' });

    const pageButton =
      container.querySelector<HTMLElement>('.details__cart-btn');

    expect(pageButton).toHaveAccessibleDescription('Details new-phone');
  });

  it('shows the favorite state of the page on the same card', async () => {
    renderApp('/phones/new-phone');

    const nav = await screen.findByRole('navigation', { name: 'Breadcrumb' });
    const label = 'Add to favorites: Phone 1';

    await userEvent.click(screen.getByRole('button', { name: label }));

    expect(screen.getByRole('button', { name: label })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await userEvent.click(within(nav).getByRole('link', { name: 'Phones' }));

    const card = (
      await screen.findByRole('heading', { name: 'Phone 1' })
    ).closest('article');

    if (!card) {
      throw new Error('No card');
    }

    expect(within(card).getByRole('button', { name: label })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
