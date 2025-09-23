import React, { useState } from 'react';
import { useParams } from 'react-router';
import useFetch from '../utilities/useFetch';
import { ProductContext } from '../ProductContext';
import { CircularProgress, IconButton } from '@mui/material';
import ProductPicks from '../components/ProductPicks';

function Product() {
  const { itemStockNo } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: productDetails, loading, error } = useFetch(
    `https://grocery-store-server-theta.vercel.app/api/items/${itemStockNo}`
  );

  if (loading) return <div className="container m-auto py-4 d-flex justify-content-center mt-3 mb-4"><CircularProgress size={30} /> </div>;
  if (error) return <div className="container m-auto py-4 d-flex justify-content-center">Error loading product.</div>;

  return (
<ProductContext.Provider value={productDetails}>
  <div className="container m-auto d-flex gap-4 border rounded-3 p-2 mb-3">
        <div className='w-100 p-2'>
          <img className='img-fluid w-100 p-2' src={productDetails?.gallery[currentIndex]} alt={''} style={{aspectRatio: '1/1', minWidth: '100%'}}/>
          <div className='d-flex gap-2 mt-2 overflow-auto justify-content-center align-items-center'>
            {productDetails?.gallery.map((img, index) => (
              <img role='button' onClick={() => setCurrentIndex(index)} key={index} className='img-fluid p-1' src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: 'center', marginRight: '8px', border: currentIndex === index ? '1px solid var(--primary-color)' : '1px solid gainsboro' }} />
            ))}
          </div>
        </div>
    <div className='p-2 px-3 w-100 d-flex flex-column justify-content-start gap-4'>
      <div>
        <div className='d-flex justify-content-end align-items-center gap-3'>
              <div role='button' className='px-1 d-flex justify-content-end align-items-center gap-2'>
                <i className='bi bi-eye fs-5' ></i> <span className='small'>Watchlist</span>
              </div>
              <div role='button' className='px-1 d-flex justify-content-end align-items-center gap-2'>
                <i className='bi bi-heart fs-5'></i> <span>Favorite</span>
              </div>
        </div>
        <h1 className='fw-semibold mb-3'>{productDetails?.name}</h1>
        <p className='mb-2 p-2 border bg-light' style={{color: 'var(--text-light)'}}>{productDetails?.description}</p>
        <small className={productDetails?.quantity > 10 ? 'text-success' : 'text-danger'}>{productDetails?.quantity > 10 ? <span className='d-flex gap-2 align-items-center'><i className='bi bi-info-circle'></i> {productDetails?.quantity} Remaining</span> : <span className='d-flex gap-2 align-items-center'><i className='bi bi-info-circle'></i> Only {productDetails?.quantity} Remaining.</span>}</small>
        <div className='d-flex gap-2 mt-1'>
          <button className='small p-1 px-4 border-0 outline-0 rounded-3' style={{ backgroundColor: 'black', color: 'white' }}>{productDetails?.views} views</button>
          {productDetails?.stock && <button className='small p-1 px-4 mr-2 border-0 outline-0 rounded-3' style={{ backgroundColor: 'green', color: 'white' }}>In stock</button>}
        </div>
      </div>
    <div className='d-flex gap-2'>
      <input style={{width: '70px'}} max={productDetails?.quantity} defaultValue={1} className='p-2 text-center rounded-2 border-1 outline-0' type='number' />
      <button className='w-100 text-light p-2 rounded-2' style={{border: '1px solid var(--primary-color)', backgroundColor: 'var(--primary-color)'}}>Make Reservation</button>
    </div>
    </div>
  </div>
  
  
  <h4 className='container mt-5 fw-bold'>Simmilar Items</h4>
{productDetails?.category && (
  <ProductPicks Simmilar={productDetails.category} />
)}

</ProductContext.Provider>
  );
}

export default Product;
