import React from 'react'
import { Link } from 'react-router'

function PageNotFound() {
  return (
  <>
      <div className='container d-flex m-auto min-vh-100 py-5 justify-content-center align-items-center gap-5'>
        <h1 style={{fontSize: '5rem', color: 'var(--bs-danger)'}}>404!</h1>
        <div><h4>Ooops!</h4>
        <small>
          The page you are looking for does not exist. It might have been moved or deleted.
        </small><br/>
        <div className='text py-2'>
                  <Link className='p-2 shadow-sm px-4 bg-light rounded-pill' to={'/'}><i className='bi bi-house'></i> &nbsp; Take me home</Link>

        </div>
        </div>
      </div>
    </>
  )
}

export default PageNotFound
