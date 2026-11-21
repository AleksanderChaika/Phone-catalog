/* eslint-disable max-len */
import { Product } from '../types/Product';
import { ProductDetails } from '../types/ProductDetails';

const BASE_URL = import.meta.env.BASE_URL;

const fetchData = async <T>(path: string): Promise<T> => {
  const url = `${BASE_URL}${path}`.replace(/\/+/g, '/');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response.json();
};

export const getProducts = (): Promise<Product[]> => {
  return fetchData<Product[]>('/api/products.json');
};

export const getProductsDetails = async (): Promise<ProductDetails[]> => {
  const [phones, tablets, accessories] = await Promise.all([
    fetchData<ProductDetails[]>('/api/phones.json'),
    fetchData<ProductDetails[]>('/api/tablets.json'),
    fetchData<ProductDetails[]>('/api/accessories.json'),
  ]);

  return [...phones, ...tablets, ...accessories];
};
