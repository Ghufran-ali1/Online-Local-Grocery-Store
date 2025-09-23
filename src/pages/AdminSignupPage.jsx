import React from 'react'
import { Link } from 'react-router';

function AdminSignupPage() {
  return (
    <div className='container m-auto pb-3'>
      <div className='border p-3 rounded-3 mb-3'>
        <h3 className='fw-semibold'>SIGNUP</h3>
          <div className='d-flex flex-column flex-lg-row gap-3'>
            <div className='w-100'>
              <form onSubmit={(e) => {
                e.preventDefault();
              }}>
                  <div>
                    <label htmlFor="username">Username</label>
                    <input className='w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2' style={{ outline: 'none', boxShadow: 'none' , backgroundColor: 'var(--primary-light)' }} type="text" id="username" />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input className='w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2' style={{ outline: 'none', boxShadow: 'none' , backgroundColor: 'var(--primary-light)' }} type="email" id="email" />
                  </div>
                  <div>
                    <label htmlFor="role">Role</label>
                    <input className='w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2' style={{ outline: 'none', boxShadow: 'none' , backgroundColor: 'var(--primary-light)' }} type="text" id="role" />
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <input className='w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2' style={{ outline: 'none', boxShadow: 'none' , backgroundColor: 'var(--primary-light)' }} type="password" id="password" />
                  </div>
                  <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input className='w-100 mt-1 mb-3 border-0 p-2 px-3 rounded-2' style={{ outline: 'none', boxShadow: 'none' , backgroundColor: 'var(--primary-light)' }} type="password" id="confirm-password" />
                  </div>
                  
                  <button type='submit' className='text-light small border-0 outline-0 p-2 w-100 mt-3 rounded-pill' style={{cursor: 'pointer', backgroundColor: 'var(--secondary-dark)'}}>Signup Now</button>
              </form>
            </div>
            <div className='w-100 d-flex justify-content-center align-items-center flex-column text-center p-3 gap-2'>
              <h3>LOGIN</h3>
              <small>Our online store is the best place to buy your favorite products. View available stock, make reservations, and enjoy exclusive deals on all groceries. Already have an account?</small>
              <Link to="/admin/login"><button className='text-light border-0 text-uppercase outline-0 p-2 px-5 mt-3 rounded-pill' style={{cursor: 'pointer', backgroundColor: 'var(--secondary-dark)'}}>Login Now</button></Link>
            </div>
          </div>
      </div>
    </div>
  )
}

export default AdminSignupPage
