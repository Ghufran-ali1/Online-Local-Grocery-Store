import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CategoriesTab from '../components/CategoriesTab'
import { useParams } from 'react-router';

function Category() {
  const { category } = useParams(); // Example category name
  return (
    <div className='container m-auto min-vh-100'>
      <CategoriesTab activeTab={category} />
      <h1>Welcome to the {category} Category Page</h1>
    </div>
  )
}

export default Category
