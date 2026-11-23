import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoriteButton } from './FavoriteButton';
import {
  FavoritesProvider,
  useFavorites,
} from '../../context/FavoritesContext';
import { createProduct } from '../../testUtils';

const product = createProduct(1, { name: 'Apple iPhone 11' });
const label = 'Add to favorites: Apple iPhone 11';

const FavoritesCount: React.FC = () => {
  const { favorites } = useFavorites();

  return <output data-testid="favorites-count">{favorites.length}</output>;
};

const renderButton = (className?: string) =>
  render(
    <FavoritesProvider>
      <FavoriteButton product={product} className={className} />
      <FavoritesCount />
    </FavoritesProvider>,
  );

describe('FavoriteButton', () => {
  it('starts not pressed, named after the product', () => {
    renderButton();

    const button = screen.getByRole('button', { name: label });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).not.toHaveClass('is-active');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('is pressed and shows the selected heart after a click', async () => {
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: label }));

    const button = screen.getByRole('button', { name: label });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('is-active');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
  });

  it('goes back on the second click', async () => {
    renderButton();

    await userEvent.click(screen.getByRole('button', { name: label }));
    await userEvent.click(screen.getByRole('button', { name: label }));

    const button = screen.getByRole('button', { name: label });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).not.toHaveClass('is-active');
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('keeps the same accessible name in both states', async () => {
    renderButton();

    const before = screen.getByRole('button').getAttribute('aria-label');

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveAttribute('aria-label', before);
    expect(before).toBe(label);
  });

  it('is pressed when the product is already in the favorites', () => {
    localStorage.setItem('favorites', JSON.stringify([product]));
    renderButton();

    expect(screen.getByRole('button', { name: label })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('is a button with a span icon and takes a className', () => {
    renderButton('size-class');

    const button = screen.getByRole('button', { name: label });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('favorite-button', 'size-class');
    expect(button.querySelector('div')).toBeNull();
    expect(button.querySelector('span.favorite-button__icon')).not.toBeNull();
  });
});
