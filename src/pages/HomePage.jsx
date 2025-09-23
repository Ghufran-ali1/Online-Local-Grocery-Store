import React from 'react'
import { ChevronRight } from '@mui/icons-material'
import CategoriesTab from '../components/CategoriesTab'
import ProductPicks from '../components/ProductPicks'

function HomePage() {
  return (
    <div>
      <div className='text-light d-flex justify-content-center py-5 m-0 p-0' 
        style={{
          backgroundColor: 'var(--primary-dark)',     // base color
          backgroundImage: 'url("/media/hero-bg.png")',
          backgroundBlendMode: 'normal',              // or 'multiply' if you want a tint
          backgroundRepeat: 'no-repeat',              // no tiling
          backgroundSize: 'cover',                  // keep the whole image visible
          backgroundPosition: 'right center',         // lock it to the right
          minHeight: '90vh',
        }}
      >
        <div className='container px-4 m-auto rounded-0'>
          <div>
            <div className='text-uppercase mb-2'><u> Grocery made convenient </u></div>
            <h1 className='fw-bold' style={{fontSize: '4rem'}}>Make your <span style={{color: 'var(--primary-color)'}}>grocery <br /> shopping <u>convenient</u>.</span></h1>
            <p className='py-2' style={{maxWidth: '700px'}}>
              We are committed to providing the best online shopping experience with a wide range of products at competitive prices. keep your home stocked with essentials and discover new favorites with us. from fresh groceries, cold drinks, snacks, and household items, we have everything you need delivered right to your doorstep.
            </p>
            <button className='text-light mt-2 p-2 px-5 d-flex justify-content-center rounded-pill border-0 outline-0 align-items-center' style={{backgroundColor: 'var(--primary-color)'}}>Shop Now &nbsp; &nbsp; <ChevronRight /> </button>
          </div>
        </div>
      </div>
      <div className='container my-3'>
        <img className='img-fluid' src="/media/wide-banner.png" alt="banner" />
      </div>

      <h4 className='container mt-5 fw-bold'>Trending Today</h4>
      <ProductPicks Trending={true} />

      <h4 className='container mt-5 fw-bold'>Top Categories</h4>
      <CategoriesTab isTopCategories={[true]} />


      <h4 className='container mt-5 fw-bold'>Top Picks</h4>
      <ProductPicks Top={true} />


      <h4 className='container mt-5 fw-bold'>New Arrivals 🔥</h4>
      <ProductPicks New={true} />


      <h4 className='container mt-5 fw-bold'>Fresh from the Farm 🔥</h4>
      <ProductPicks Fresh={true} />
    </div>
  )
}

export default HomePage
