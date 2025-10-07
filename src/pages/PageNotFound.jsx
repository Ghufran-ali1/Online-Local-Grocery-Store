import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import AppBreadcrumbs from '../components/Breadcrumbs'

function PageNotFound() {
  return (
  <>
      <Header />
      <div className='container d-flex m-auto min-vh-100 py-5 justify-content-center align-items-center gap-5'>
        <h1 style={{fontSize: '5rem', color: 'var(--bs-danger)'}}>404!</h1>
        <div><h4>Ooops!</h4>
        <small>
          The page you are looking for does not exist. It might have been moved or deleted.
        </small>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PageNotFound
