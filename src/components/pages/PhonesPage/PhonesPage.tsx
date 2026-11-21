/* eslint-disable max-len */
import './PhonesPage.scss';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../../../types/Product';
import { ProductCard } from '../../ProductCard/ProductCard';
import { SortSelector } from '../../SortSelector/SortSelector';
import { ItemsPerPage } from '../../ItemsPerPage/ItemsPerPage';
import { Pagination } from '../../Pagination/Pagination';
import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';

interface Props {
  products: Product[];
  title: string;
}

export const PhonesPage: React.FC<Props> = ({ products, title }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sort') || 'age';
  const perPage = searchParams.get('perPage') || '16';
  const pageParam = searchParams.get('page');

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      default:
        return b.year - a.year;
    }
  });

  const total = sortedProducts.length;
  const isAll = perPage === 'all';
  const itemsCount = isAll ? total : Number(perPage);

  // Keep the page inside 1..totalPages, so ?page=99 never shows an empty list
  const totalPages = itemsCount > 0 ? Math.ceil(total / itemsCount) : 1;
  const requestedPage = Math.trunc(Number(pageParam)) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);

  useEffect(() => {
    if (pageParam === null || isAll || total === 0) {
      return;
    }

    if (pageParam !== String(currentPage)) {
      const params = new URLSearchParams(searchParams);

      params.set('page', String(currentPage));
      setSearchParams(params, { replace: true });
    }
  }, [pageParam, currentPage, isAll, total, searchParams, setSearchParams]);

  const start = (currentPage - 1) * itemsCount;
  const end = isAll ? total : start + itemsCount;
  const visibleProducts = sortedProducts.slice(start, end);

  return (
    <div className="phones-page container">
      <Breadcrumbs />

      <h1 className="phones-page__title">{title}</h1>
      <p className="phones-page__count">{`${total} models`}</p>

      {total > 0 ? (
        <>
          <div className="phones-page__filters">
            <SortSelector />
            <ItemsPerPage />
          </div>

          <div className="phones-page__list">
            {visibleProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!isAll && total > itemsCount && (
            <Pagination total={total} perPage={itemsCount} />
          )}
        </>
      ) : (
        <p className="phones-page__empty">
          {`No ${title.toLowerCase()} found`}
        </p>
      )}
    </div>
  );
};
