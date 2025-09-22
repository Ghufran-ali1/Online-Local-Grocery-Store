import { Link } from 'react-router';
import useFetch from '../utilities/useFetch';
import { useEffect, useState } from 'react';
import LastPageIcon from '@mui/icons-material/LastPage';
import IconButton from '@mui/material/IconButton';


function Footer() {
      const { data: items, loading, error } = useFetch("https://grocery-store-server-theta.vercel.app/api/items");
      const [topCategories, setTopCategories] = useState(['Fruits', 'Vegetables', 'Snacks', 'Beverages', 'Meat']);
  
    useEffect(() => {
      if (items) {
        const categories = items
          ?.map(item => item.category)
          .reduce((acc, category) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});
          const sortedCategories = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name);
      setTopCategories(sortedCategories);
      }
    }, [items]);

  return (
    <div className='mt-3 p-3 pb-2 position-relative' style={{backgroundColor: 'var(--background-light)'}}>
      <IconButton aria-label="scroll to top" style={{position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'var(--primary-color)', color: 'var(--background-color)', zIndex: 1000, transform: 'rotate(-90deg)'}} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <LastPageIcon />
      </IconButton>
      <footer className='container d-flex gap-1 justify-content-between m-auto'>
        <div className='w-50 flex-grow'>
          <img src='/media/logo.png' height={40} alt='Logo' className='mb-3' />
          <div>
            <p>
              We are committed to providing the best online shopping experience with a wide range of products at competitive prices. keep your home stocked with essentials and discover new favorites with us. from fresh groceries, cold drinks, snacks, and household items, we have everything you need delivered right to your doorstep.
            </p>
          </div>
        </div>
        <div className='w-25 p-2'>
          <h5 className='fw-semibold mt-3'>Quick Links</h5>
          <div>
            <ol>
              <Link onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} to='/' className='text-decoration-none text-dark'><li className='mb-2'>Home</li></Link>
              <Link onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} to='/store' className='text-decoration-none text-dark'><li className='mb-2'>Store</li></Link>
              {
                topCategories?.map(category => (
                  <Link onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} key={category} to={`/store/${category.toLowerCase().replace(/\s+/g, '-')}`} className='text-decoration-none text-dark'>
                    <li className='mb-2'>{category}</li>
                  </Link>
                ))
              }
            </ol>
          </div>

        </div>
        
        <div className='w-25 p-2'>
          <h5 className='fw-semibold mt-3'>Contact Us</h5>
          <p className='small m-0 text-muted'>If you have any questions or feedback, feel free to reach out to the store!</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!e.target[0].value.trim() || !e.target[1].value){
              alert('Please fill in all fields.');
               return 0;
            };
            console.log('Summary: ', (e.target[0].value), (e.target[1].value));
            e.target.reset();
            alert('Enquiry sent successfully!');
          }}>
            <div>
            <label className='fw-semibold small'>Email address:</label>
            <input type='email' className='form-control border-0 outline-0 shadow-none mt-1 mb-2' style={{backgroundColor: 'var(--primary-light)'}} placeholder='Enter your email' />
            </div>
            <div>
            <label className='fw-semibold small'>Enter message:</label>
            <textarea className='form-control border-0 outline-0 shadow-none mt-1 mb-2' style={{backgroundColor: 'var(--primary-light)'}} placeholder='Enter your message' rows={5} />
            </div>
            <button type='submit' className='text-light small border-0 outline-0 p-2 w-100 mt-3 rounded-pill' style={{cursor: 'pointer', backgroundColor: 'var(--secondary-dark)'}}>Send enquiry</button>
          </form>
        </div>
      </footer>
        <p className='text-center mb-1'>© 2023 Ghufran Online Store. All rights reserved.</p>
    </div>
  )
}

export default Footer
