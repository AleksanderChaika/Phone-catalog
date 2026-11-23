/* eslint-disable max-len */
import React from 'react';
import './HomePage.scss';
import { Product } from '../../../types/Product';
import { Banner } from '../../Banner';
import { ProductsSlider } from '../../ProductsSlider';
import { Categories } from '../../Categories';
import { NEW_MODELS_FROM_YEAR, hasDiscount } from '../../../utils/discount';

interface Props {
  products: Product[];
}

export const HomePage: React.FC<Props> = ({ products }) => {
  const brandNew = products
    .filter(product => product.year >= NEW_MODELS_FROM_YEAR)
    .sort((a, b) => b.price - a.price);

  const hotPrices = products
    .filter(hasDiscount)
    .sort((a, b) => b.fullPrice - b.price - (a.fullPrice - a.price));

  return (
    <div className="home-page">
      <div className="container">
        <h1 className="main-title">Welcome to Nice Gadgets store!</h1>

        <section className="home-page__section">
          <Banner />
        </section>

        <section className="home-page__section">
          <ProductsSlider title="Brand new models" products={brandNew} />
        </section>

        <section className="home-page__section">
          <Categories products={products} />
        </section>

        <section className="home-page__section">
          <ProductsSlider title="Hot prices" products={hotPrices} />
        </section>
      </div>
    </div>
  );
};
