import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';
import { routerFuture } from '../../testUtils';

const renderBreadcrumbs = (url: string, currentLabel?: string) =>
  render(
    <MemoryRouter initialEntries={[url]} future={routerFuture}>
      <Breadcrumbs currentLabel={currentLabel} />
    </MemoryRouter>,
  );

describe('Breadcrumbs', () => {
  it('is a navigation landmark with a named home link', () => {
    renderBreadcrumbs('/phones');

    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('renders a hidden separator before every item', () => {
    const { container } = renderBreadcrumbs('/phones/apple-iphone');

    const separators = container.querySelectorAll('.breadcrumbs__separator');

    expect(separators).toHaveLength(2);
    separators.forEach(separator =>
      expect(separator).toHaveAttribute('aria-hidden', 'true'),
    );
  });

  it('marks only the last item as the current page', () => {
    renderBreadcrumbs('/phones/apple-iphone');

    expect(screen.getByRole('link', { name: 'Phones' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByText('Apple iphone')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('uses currentLabel for the last item and as its title', () => {
    renderBreadcrumbs('/phones/apple-iphone-11', 'Apple iPhone 11 64GB Gold');

    const current = screen.getByText('Apple iPhone 11 64GB Gold');

    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveAttribute('title', 'Apple iPhone 11 64GB Gold');
    expect(screen.getByRole('link', { name: 'Phones' })).toBeVisible();
  });
});
