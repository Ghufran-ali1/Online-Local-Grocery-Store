import React from 'react';
import { useParams } from 'react-router';
import useFetch from '../utilities/useFetch';
import { ProductContext } from '../ProductContext';

function Product() {
  const { itemStockNo } = useParams();
  const { data: productDetails, loading, error } = useFetch(
    `https://grocery-store-server-theta.vercel.app/api/items/${itemStockNo}`
  );

  if (loading) return <div className="container m-auto min-vh-100">Loading...</div>;
  if (error) return <div className="container m-auto min-vh-100">Error loading product.</div>;

  return (
    // 👇 Provide the fetched product to the breadcrumb via context
    <ProductContext.Provider value={productDetails}>
      <div className="container m-auto min-vh-100 border rounded-3 p-2">
        <h1>{productDetails?.name}</h1>
        <p>{productDetails?.description}</p>
      </div>
    </ProductContext.Provider>
  );
}

export default Product;
