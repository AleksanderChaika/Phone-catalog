/* eslint-disable max-len */
import React, { useCallback, useEffect, useRef } from 'react';
import { useCart } from '../../../context/CartContext';
import { CartItem } from '../../CartItem/CartItem';
import './CartPage.scss';

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const CartPage: React.FC = () => {
  const {
    cart,
    totalAmount,
    totalItems,
    handleCheckout,
    closeCheckout,
    isCheckout,
  } = useCart();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isModalOpen = isCheckout && cart.length > 0;

  const handleClose = useCallback(() => {
    closeCheckout();
    // The Checkout button disappears together with the cleared cart,
    // so focus goes to the page title instead of getting lost
    titleRef.current?.focus();
  }, [closeCheckout]);

  useEffect(() => {
    if (!isModalOpen) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }

      // Close is the only focusable element, so keep focus inside the modal
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose]);

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <button
          type="button"
          className="cart-page__back"
          onClick={() => window.history.back()}
          data-cy="backButton"
        >
          <img
            src={`${BASE}img/icons/arrow-left.svg`}
            alt=""
            className="cart-page__back-icon"
          />
          Back
        </button>

        <h1 className="cart-page__title" ref={titleRef} tabIndex={-1}>
          Cart
        </h1>

        <div className="cart-page__content">
          {cart.length > 0 ? (
            <>
              <div className="cart-page__list">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className="summary">
                <div className="summary__total">${totalAmount}</div>
                <div className="summary__count">
                  Total for {totalItems} items
                </div>
                <div className="summary__line" />
                <button
                  type="button"
                  className="summary__checkout-btn"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="checkout-modal">
          <div
            className="checkout-modal__backdrop"
            aria-hidden="true"
            onClick={handleClose}
          />
          <div
            className="checkout-modal__box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
          >
            <h2 id="checkout-modal-title" className="checkout-modal__title">
              Order placed
            </h2>
            <p className="checkout-modal__text">
              Thank you for your order! This is a demo store, so no payment was
              made.
            </p>
            <button
              type="button"
              className="btn-primary"
              ref={closeButtonRef}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
