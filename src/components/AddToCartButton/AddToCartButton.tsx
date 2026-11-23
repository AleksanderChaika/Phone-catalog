import './AddToCartButton.scss';
import React from 'react';
import { Product } from '../../types/Product';
import { useCart } from '../../context/CartContext';

interface Props {
  product: Product;
  className?: string;
  describedById?: string;
}

export const AddToCartButton: React.FC<Props> = ({
  product,
  className,
  describedById,
}) => {
  const { cart, addToCart, removeFromCart } = useCart();

  const isInCart = cart.some(item => item.id === product.id);

  const handleClick = () => {
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const classes = ['add-to-cart', isInCart ? 'is-active' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={handleClick}
      aria-describedby={describedById}
    >
      {isInCart ? 'Added' : 'Add to cart'}
    </button>
  );
};
