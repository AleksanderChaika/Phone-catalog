import { Product } from '../types/Product';

export const NEW_MODELS_FROM_YEAR = 2022;

export const hasDiscount = ({
  year,
  price,
  fullPrice,
}: Pick<Product, 'year' | 'price' | 'fullPrice'>): boolean =>
  year < NEW_MODELS_FROM_YEAR && fullPrice > price;
