import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductContext } from './ProductContext';
import useFetch from './utilities/useFetch';

export default function ProductProvider({ children }) {
  const { itemStockNo } = useParams();
  const { data, loading, error } = useFetch(
    `https://grocery-store-server-theta.vercel.app/api/items/${itemStockNo}`
  );

  // while loading, value is null, then switches to the product name string
  return (
    <ProductContext.Provider value={data ? data.name : null}>
      {children}
    </ProductContext.Provider>
  );
}
