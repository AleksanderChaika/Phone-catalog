import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Pagination } from './Pagination';
import { LocationProbe, routerFuture } from '../../testUtils';

const renderPagination = (url: string, total = 100, perPage = 10) =>
  render(
    <MemoryRouter initialEntries={[url]} future={routerFuture}>
      <Pagination total={total} perPage={perPage} />
      <LocationProbe />
    </MemoryRouter>,
  );

const pageNumbers = () =>
  screen
    .getAllByRole('button')
    .map(button => button.textContent)
    .filter(text => text);

describe('Pagination', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('renders nothing when everything fits on one page', () => {
    renderPagination('/phones', 10, 16);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows the first four pages and disables Previous on page 1', () => {
    renderPagination('/phones');

    expect(pageNumbers()).toEqual(['1', '2', '3', '4']);
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('keeps the current page inside the visible window', () => {
    renderPagination('/phones?page=5');

    expect(pageNumbers()).toEqual(['4', '5', '6', '7']);
  });

  it('shows the last four pages and disables Next on the last page', () => {
    renderPagination('/phones?page=10');

    expect(pageNumbers()).toEqual(['7', '8', '9', '10']);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('marks only the current page with aria-current', () => {
    renderPagination('/phones?page=3');

    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('changes the page in the URL and keeps the other params', async () => {
    const user = userEvent.setup();

    renderPagination('/phones?sort=price&page=2');

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/phones?sort=price&page=3',
    );

    await user.click(screen.getByRole('button', { name: 'Previous page' }));

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/phones?sort=price&page=2',
    );
  });
});
