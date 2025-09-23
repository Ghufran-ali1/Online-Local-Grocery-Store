// src/components/Breadcrumbs.jsx
import { useLocation, Link as RouterLink, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ProductContext } from '../ProductContext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import useFetch from '../utilities/useFetch';
import { AdminContext } from '../AdminContext';
import { AccountCircle, AccountCircleOutlined, Logout, NoAccountsOutlined } from '@mui/icons-material';



export default function AppBreadcrumbs({isAdminPage = false,}) {  
    const  adminDetails = useContext(AdminContext);
    const { itemStockNo } = useParams();
    const { data, loading, error } = useFetch(
      `https://grocery-store-server-theta.vercel.app/api/items${itemStockNo ? `/${itemStockNo}` : ''}`
    );
  const location = useLocation();
  const productName = useContext(ProductContext);
  const pathnames = location.pathname.split('/').filter(Boolean);


 const crumbs = pathnames.map((_, idx) => {
  const to = '/' + pathnames.slice(0, idx + 1).join('/');

  let raw = decodeURIComponent(pathnames[idx])
              .replace(/-/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase());
  let display = raw; // what we render

  if (idx === pathnames.length - 1 && productName) {
    raw = productName;
    display = productName;
  }
  if (raw.startsWith('STK')) {
    display = <span style={{color: 'var(--text-light)'}}>{data?.name || 'Loading...'}</span>;
  }
  if (raw === 'Login' || raw === 'Signup') {
    raw = raw === 'Login' ? 'Admin Login' : 'Admin Signup';
    display = <span style={{color: 'var(--text-light)'}}>{raw}</span>;
  }
  if (raw === 'Admin') {
    raw = 'Store Administrator';
    display = raw;
  }

  return { to, raw, display };
});



const lastRaw = crumbs[crumbs.length - 1]?.raw || '';

  return (
      <div className='container m-auto py-2 mb-2 d-flex justify-content-between'>
        <Breadcrumbs
          separator={<NavigateNextIcon  fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ my: 1 }}
        >
          <Link
            component={RouterLink}
            className='text-decoration-none link'
            style={{ color: 'var(--text-color)' }}
            to="/"
          >
            Home
          </Link>
    
          {crumbs.map((c, idx) =>
            idx === crumbs.length - 1 ? (
              <Typography style={{ color: 'var(--text-light)' }} key={c.to}>
                {c.display}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                className='text-decoration-none link'
                style={{ color: 'var(--text-color)' }}
                to={c.to}
                key={c.to}
              >
                {c.display}
              </Link>
            )
          )}
        </Breadcrumbs>

{(lastRaw === 'Admin Login' || lastRaw === 'Admin Signup' || lastRaw === 'Store Administrator') && (
  adminDetails ? <div  className='p-2 text-black d-flex gap-2 align-items-center'><span role='button' className='text-success px-1'><AccountCircleOutlined /> Logged in as User247</span> | <span role='button' className='text-danger d-flex align-items-center px-1'>Logout &nbsp; <Logout fontSize={'small'} /></span></div> : <div className='p-2 text-danger d-flex gap-2 align-items-center' role='button'>Not logged in <NoAccountsOutlined /></div>
  )}
  </div>
  );
}
