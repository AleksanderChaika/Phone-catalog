import './FavoriteButton.scss';
import React from 'react';
import { Product } from '../../types/Product';
import { useFavorites } from '../../context/FavoritesContext';

interface Props {
  product: Product;
  className?: string;
}

export const FavoriteButton: React.FC<Props> = ({ product, className }) => {
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorite = favorites.some(item => item.id === product.id);

  const classes = ['favorite-button', isFavorite ? 'is-active' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={`Add to favorites: ${product.name}`}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(product)}
    >
      <span className="favorite-button__icon" />
    </button>
  );
};
