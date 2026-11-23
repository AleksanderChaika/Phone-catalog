/* eslint-disable max-len */
import React, { useState, useEffect, useId } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../../../types/Product';
import { ProductDetails } from '../../../types/ProductDetails';
import { AddToCartButton } from '../../AddToCartButton';
import { Breadcrumbs } from '../../Breadcrumbs';
import { FavoriteButton } from '../../FavoriteButton';
import { ProductCard } from '../../ProductCard';
import { NotFoundPage } from '../NotFoundPage';
import { hasDiscount } from '../../../utils/discount';
import './ProductDetailsPage.scss';

interface Props {
  products: Product[];
  details: ProductDetails[];
}

export const ProductDetailsPage: React.FC<Props> = ({ products, details }) => {
  const { category, productId } = useParams();
  const titleId = useId();

  const product = details.find(d => d.id === productId);
  const baseProduct = products.find(p => p.itemId === productId);

  const [selectedImage, setSelectedImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(288);
  const visibleCards = 4;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 639.5 && window.innerWidth < 1200) {
        setStep(253);
      } else {
        setStep(288);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setCurrentIndex(0);
    }
  }, [product]);

  if (!product || !baseProduct) {
    const isKnownCategory = ['phones', 'tablets', 'accessories'].includes(
      category ?? '',
    );

    return (
      <NotFoundPage
        subtitle="Product not found"
        text="We couldn't find a product with this ID. It may have been removed or the link is incorrect."
        linkTo={isKnownCategory ? `/${category}` : '/'}
        linkLabel={isKnownCategory ? `Back to ${category}` : 'Go to Home Page'}
      />
    );
  }

  const categoryPath = `/${baseProduct.category}`;

  const recommendedProducts = products
    .filter(p => p.category === baseProduct.category && p.itemId !== productId)
    .slice(0, 12);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < recommendedProducts.length - visibleCards) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getColorHex = (colorName: string) => {
    const normalizedName = colorName.toLowerCase().replace(/\s+/g, '');
    const colors: { [key: string]: string } = {
      gold: '#FCDBC1',
      grey: '#3B3E4A',
      spacegray: '#3B3E4A',
      spacegrey: '#3B3E4A',
      black: '#0F1121',
      white: '#FFFFFF',
      midnightgreen: '#004953',
      rosegold: '#FADADD',
      graphite: '#41424C',
      sierrablue: '#9BB5CE',
      blue: '#215E7C',
      silver: '#E2E3E4',
      pink: '#FAE3E3',
      midnight: '#191970',
      starlight: '#F8F9EC',
    };

    return colors[normalizedName] || colorName;
  };

  return (
    <div className="details container" data-cy="productDetails">
      <Breadcrumbs currentLabel={product.name} />

      <Link
        to={categoryPath}
        className="details__back-link"
        data-cy="backButton"
      >
        Back
      </Link>

      <h1 id={titleId} className="details__title">
        {product.name}
      </h1>

      <div className="details__content">
        <div className="details__gallery">
          <div className="details__main-img">
            {selectedImage && <img src={selectedImage} alt={product.name} />}
          </div>

          <div className="details__thumbnails">
            {product.images.map(img => (
              <button
                type="button"
                key={img}
                className={`details__thumb ${img === selectedImage ? 'is-active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt="thumbnail" />
              </button>
            ))}
          </div>
        </div>

        <div className="details__actions-panel">
          <div className="details__section">
            <span className="details__section-label">Available colors</span>
            <div className="details__colors">
              {product.colorsAvailable.map(color => (
                <Link
                  key={color}
                  to={`${categoryPath}/${product.namespaceId}-${product.capacity.toLowerCase()}-${color.replace(/\s+/g, '-')}`}
                  className={`details__color ${color === product.color ? 'is-active' : ''}`}
                  style={{ backgroundColor: getColorHex(color) }}
                />
              ))}
            </div>
          </div>

          <div className="details__section">
            <span className="details__section-label">Select capacity</span>
            <div className="details__capacity">
              {product.capacityAvailable.map(cap => (
                <Link
                  key={cap}
                  to={`${categoryPath}/${product.namespaceId}-${cap.toLowerCase()}-${product.color.replace(/\s+/g, '-')}`}
                  className={`details__capacity-btn ${cap === product.capacity ? 'is-active' : ''}`}
                >
                  {cap}
                </Link>
              ))}
            </div>
          </div>

          <div className="details__price-block">
            <span className="details__price">{`$${baseProduct.price}`}</span>
            {hasDiscount(baseProduct) && (
              <span className="details__price-old">{`$${baseProduct.fullPrice}`}</span>
            )}
          </div>

          <div className="details__actions">
            <AddToCartButton
              product={baseProduct}
              className="details__cart-btn"
              describedById={titleId}
            />
            <FavoriteButton
              product={baseProduct}
              className="details__favorite-btn"
            />
          </div>

          <div className="details__specs-short">
            {[
              { label: 'Screen', value: product.screen },
              { label: 'Resolution', value: product.resolution },
              { label: 'Processor', value: product.processor },
              { label: 'RAM', value: product.ram },
            ].map(spec => (
              <div key={spec.label} className="details__specs-item">
                <span className="details__specs-label">{spec.label}</span>
                <span className="details__specs-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="details__description">
        <section className="details__about">
          <h2 className="details__subtitle">About</h2>
          {product.description.map(item => (
            <div key={item.title} className="details__text-block">
              <h3 className="details__section-title">{item.title}</h3>
              {item.text.map(paragraph => (
                <p key={paragraph} className="details__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </section>

        <section className="details__specs-full">
          <h2 className="details__subtitle">Tech specs</h2>
          <div className="details__specs-list">
            {[
              { label: 'Screen', value: product.screen },
              { label: 'Resolution', value: product.resolution },
              { label: 'Processor', value: product.processor },
              { label: 'RAM', value: product.ram },
              { label: 'Built in memory', value: product.capacity },
              { label: 'Camera', value: product.camera },
              { label: 'Zoom', value: product.zoom },
              { label: 'Cell', value: product.cell.join(', ') },
            ]
              .filter(spec => spec.value && spec.value.length > 0)
              .map(spec => (
                <div key={spec.label} className="details__specs-row">
                  <span className="details__specs-label">{spec.label}</span>
                  <span className="details__specs-value">{spec.value}</span>
                </div>
              ))}
          </div>
        </section>
      </div>

      <section className="details__suggested">
        <div className="details__suggested-header">
          <h2 className="details__suggested-title">You may also like</h2>
          <div className="details__suggested-arrows">
            <button
              type="button"
              className={`details__suggested-arrow details__suggested-arrow--left ${currentIndex === 0 ? 'is-disabled' : ''}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            />
            <button
              type="button"
              className={`details__suggested-arrow details__suggested-arrow--right ${
                currentIndex >= recommendedProducts.length - visibleCards
                  ? 'is-disabled'
                  : ''
              }`}
              onClick={handleNext}
              disabled={
                currentIndex >= recommendedProducts.length - visibleCards
              }
            />
          </div>
        </div>

        <div className="details__suggested-overflow">
          <div
            className="details__suggested-list"
            style={{ transform: `translateX(-${currentIndex * step}px)` }}
          >
            {recommendedProducts.map(recProduct => (
              <div key={recProduct.id} className="details__card-container">
                <ProductCard product={recProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
