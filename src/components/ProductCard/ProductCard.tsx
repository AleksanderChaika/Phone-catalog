/* eslint-disable max-len */
import React, { useId } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/Product';
import { hasDiscount } from '../../utils/discount';
import { AddToCartButton } from '../AddToCartButton';
import { FavoriteButton } from '../FavoriteButton';
import './ProductCard.scss';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const titleId = useId();

  const imagePath = product.image;

  return (
    <article className="product-card" data-cy="cardsContainer">
      <Link
        to={`/${product.category}/${product.itemId}`}
        className="product-card__link"
      >
        <div className="product-card__image-container">
          <img
            src={imagePath}
            alt={product.name}
            className="product-card__image"
          />
        </div>
        <h3 id={titleId} className="product-card__title">
          {product.name}
        </h3>
      </Link>

      <div className="product-card__price">
        <span className="product-card__price-new">{`$${product.price}`}</span>
        {hasDiscount(product) && (
          <span className="product-card__price-old">{`$${product.fullPrice}`}</span>
        )}
      </div>

      <div className="product-card__divider" />

      <div className="product-card__specs">
        <div className="product-card__spec">
          <span className="product-card__spec-label">Screen</span>
          <span className="product-card__spec-value">{product.screen}</span>
        </div>
        <div className="product-card__spec">
          <span className="product-card__spec-label">
            {product.category === 'accessories' ? 'Size' : 'Capacity'}
          </span>
          <span className="product-card__spec-value">{product.capacity}</span>
        </div>
        <div className="product-card__spec">
          <span className="product-card__spec-label">RAM</span>
          <span className="product-card__spec-value">{product.ram}</span>
        </div>
      </div>

      <div className="product-card__buttons">
        <AddToCartButton
          product={product}
          className="product-card__btn-cart"
          describedById={titleId}
        />

        <FavoriteButton product={product} className="product-card__btn-fav" />
      </div>
    </article>
  );
};
